import { MessageCircle } from "lucide-react"
import { whatsappHref } from "@/lib/site.config"

export function WhatsappButton() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-xl transition-transform hover:scale-105"
      style={{ animation: "pulse-ring 2.5s ease-out infinite" }}
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  )
}
