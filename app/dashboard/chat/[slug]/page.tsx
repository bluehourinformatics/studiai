import ChatPageClient from "@/components/dashboard/dashboard-chat-client";
import { getBookBySlug } from "@/lib/actions/book";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: book } = await getBookBySlug(slug);
  // console.log(slug);

  return (
    <div>
      <ChatPageClient book={book} />
    </div>
  );
}
