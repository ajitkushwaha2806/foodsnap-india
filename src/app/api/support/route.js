import { GET as getTickets, POST as postTickets } from "@/app/api/tickets/route";

export async function GET(request) {
  return getTickets(request);
}

export async function POST(request) {
  return postTickets(request);
}
