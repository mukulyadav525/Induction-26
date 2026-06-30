import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const web3FormsKey = process.env.NEXT_WEB3_KEY;

  if (!web3FormsKey) {
    return NextResponse.json(
      {
        success: false,
        message: "Form not configured — missing NEXT_WEB3_KEY.",
      },
      { status: 500 },
    );
  }

  const incomingFormData = await request.formData();

  const outgoingFormData = new FormData();
  outgoingFormData.append("access_key", web3FormsKey);
  outgoingFormData.append("subject", "Induction '26 — Website Inquiry");
  outgoingFormData.append("from_name", "Induction '26 Website");
  outgoingFormData.append("redirect", "false");

  for (const [fieldName, fieldValue] of incomingFormData.entries()) {
    outgoingFormData.append(fieldName, fieldValue);
  }

  const web3FormsResponse = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; Induction26Server/1.0)",
      Accept: "application/json",
    },
    body: outgoingFormData,
  });

  const responseText = await web3FormsResponse.text();
  let responseJson;
  try {
    responseJson = JSON.parse(responseText);
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: `Web3Forms returned non-JSON response: ${responseText.slice(0, 200)}`,
      },
      { status: web3FormsResponse.status || 502 },
    );
  }
  return NextResponse.json(responseJson, { status: web3FormsResponse.status });
}
