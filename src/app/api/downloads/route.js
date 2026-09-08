import { GET as getImagesDownloads } from "@/app/api/images/downloads/route";

export async function GET(request) {
  return getImagesDownloads(request);
}
