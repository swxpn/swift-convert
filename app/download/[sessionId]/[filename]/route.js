import { GET as apiGET } from "../../../api/download/[sessionId]/[filename]/route";
export const runtime = "nodejs";

export async function GET(request, { params }) {
  return apiGET(request, { params: await params });
}
