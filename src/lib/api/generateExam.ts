export async function generateExamZip(options: {
  questions: unknown; // replace with your Question[] type
  endpoint?: string;
  filenamePrefix?: string;
}) {
  const {
    questions,
    endpoint = process.env.NEXT_PUBLIC_GENERATE_EXAM_ENDPOINT_URL ??
      "https://api.tacknowledge.co.uk/api/generate-exam",
    filenamePrefix = "exam",
  } = options;

  if (!endpoint) {
    throw new Error(
      "Backend API URL is not configured. Check NEXT_PUBLIC_GENERATE_EXAM_ENDPOINT_URL."
    );
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    body: JSON.stringify(questions),
  });

  if (!response.ok) {
    // optional: try to extract backend error text
    const errText = await response.text().catch(() => "");
    throw new Error(errText || "ZIP generation failed");
  }

  const zipBlob = await response.blob();

  const downloadUrl = window.URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `${filenamePrefix}-${Date.now()}.zip`;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(downloadUrl);
  document.body.removeChild(a);
}
