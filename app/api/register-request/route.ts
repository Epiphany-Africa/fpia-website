import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/server/adminSupabase";
import {
  checkRegisterRateLimit,
  detectRegisterSpam,
  getClientIp,
  logRegisterIntakeFailure,
} from "@/lib/server/registerIntakeProtection";

function normalizeRequiredString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

function normalizeOptionalString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidDate(value: string | null) {
  if (!value) return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function buildPropertyAddress(parts: Array<string | null>) {
  return parts.filter((part): part is string => Boolean(part)).join(", ");
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const clientIp = getClientIp(request.headers);

  try {
    const body = await request.json();
    const honeypot = normalizeOptionalString(body?.company_website, 240);
    const rateLimit = checkRegisterRateLimit(clientIp);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many registration attempts. Please wait a few minutes and try again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const streetAddress = normalizeRequiredString(body?.street_address, 240);
    const suburb = normalizeOptionalString(body?.suburb, 120);
    const city = normalizeOptionalString(body?.city, 120);
    const province = normalizeOptionalString(body?.province, 120);
    const erfNumber = normalizeOptionalString(body?.erf_number, 80);
    const fullName = normalizeRequiredString(body?.full_name, 160);
    const email = normalizeRequiredString(body?.email, 200)?.toLowerCase() ?? null;
    const phone = normalizeOptionalString(body?.phone, 40);
    const roleInTransaction = normalizeRequiredString(body?.role_in_transaction, 80);
    const transactionType = normalizeRequiredString(body?.transaction_type, 80);
    const idNumber = normalizeOptionalString(body?.id_number, 80);
    const contactName = normalizeOptionalString(body?.contact_name, 160);
    const contactPhone = normalizeOptionalString(body?.contact_phone, 40);
    const agentName = normalizeOptionalString(body?.agent_name, 160);
    const agency = normalizeOptionalString(body?.agency, 160);
    const agentEmail = normalizeOptionalString(body?.agent_email, 200)?.toLowerCase() ?? null;
    const agentPhone = normalizeOptionalString(body?.agent_phone, 40);
    const preferredDate = normalizeOptionalString(body?.preferred_date, 20);
    const alternativeDate = normalizeOptionalString(body?.alternative_date, 20);
    const additionalNotes = normalizeOptionalString(body?.additional_notes, 3000);
    const spamReason = detectRegisterSpam({
      honeypot,
      fullName,
      email,
      propertyAddress: streetAddress,
      notes: additionalNotes,
      agentName,
      contactName,
    });

    if (spamReason) {
      logRegisterIntakeFailure("spam_rejected", {
        requestId,
        clientIp,
        reason: spamReason,
      });

      return NextResponse.json(
        { error: "We could not accept that registration. Please review your details and try again." },
        { status: 400 }
      );
    }

    if (
      !streetAddress ||
      !fullName ||
      !email ||
      !roleInTransaction ||
      !transactionType
    ) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (agentEmail && !isValidEmail(agentEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid agent email address." },
        { status: 400 }
      );
    }

    if (!isValidDate(preferredDate) || !isValidDate(alternativeDate)) {
      return NextResponse.json(
        { error: "Please provide valid inspection dates." },
        { status: 400 }
      );
    }

    if (fullName.length < 3 || streetAddress.length < 8) {
      return NextResponse.json(
        { error: "Please provide complete registration details." },
        { status: 400 }
      );
    }

    const propertyAddress = buildPropertyAddress([
      streetAddress,
      suburb,
      city,
      province,
    ]);

    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("registration_requests")
      .insert({
        full_name: fullName,
        email,
        phone,
        property_address: propertyAddress,
        suburb,
        city,
        role_in_transaction: roleInTransaction,
        transaction_type: transactionType,
        status: "submitted",
        raw_payload: {
          street_address: streetAddress,
          suburb,
          city,
          province,
          erf_number: erfNumber,
          seller_name: fullName,
          seller_email: email,
          seller_phone: phone,
          id_number: idNumber,
          contact_name: contactName,
          contact_phone: contactPhone,
          agent_name: agentName,
          agency,
          agent_email: agentEmail,
          agent_phone: agentPhone,
          preferred_date: preferredDate,
          alternative_date: alternativeDate,
          additional_notes: additionalNotes,
          role_in_transaction: roleInTransaction,
          transaction_type: transactionType,
        },
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      logRegisterIntakeFailure("insert_failed", {
        requestId,
        clientIp,
        code: error?.code ?? null,
        message: error?.message ?? null,
      });

      return NextResponse.json(
        {
          error:
            "We could not submit your registration right now. Please try again shortly.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, requestId: data.id });
  } catch (error) {
    logRegisterIntakeFailure("unexpected_error", {
      requestId,
      clientIp,
      message: error instanceof Error ? error.message : "unknown",
    });

    return NextResponse.json(
      { error: "We could not submit your registration right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
