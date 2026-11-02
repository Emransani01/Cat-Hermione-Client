"use client";

import { useState } from "react";
import {
  Share2,
  Users,
  Send,
  MessageCircle,
  Mail,
  Link as LinkIcon,
  Copy,
  X,
  Smartphone,
} from "lucide-react";
import toast from "react-hot-toast";

function XLogo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ShareButton({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const getShareUrl = () => encodeURIComponent(window.location.href);
  const getShareText = () =>
    encodeURIComponent(`Check out this event: ${title}`);

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Check out this event: ${title}`,
          url,
        });
      } else {
        await handleCopyLink();
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Unable to share the event.");
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied!");
    } catch {
      toast.error("Unable to copy the event link.");
    }
  };

  const handleFacebookShare = () => {
    openShareWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${getShareUrl()}`,
    );
  };

  const handleWhatsAppShare = () => {
    openShareWindow(
      `https://wa.me/?text=${getShareText()}%20${getShareUrl()}`,
    );
  };

  const handleMessengerShare = () => {
    openShareWindow(
      `https://www.facebook.com/dialog/send?link=${getShareUrl()}&redirect_uri=${getShareUrl()}`,
    );
  };

  const handleXShare = () => {
    openShareWindow(
      `https://twitter.com/intent/tweet?text=${getShareText()}&url=${getShareUrl()}`,
    );
  };

  const handleTelegramShare = () => {
    openShareWindow(
      `https://t.me/share/url?url=${getShareUrl()}&text=${getShareText()}`,
    );
  };

  const handleLinkedInShare = () => {
    openShareWindow(
      `https://www.linkedin.com/sharing/share-offsite/?url=${getShareUrl()}`,
    );
  };

  const handleEmailShare = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${getShareText()}%20${getShareUrl()}`;
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn w-full gap-2 rounded-lg border border-primary/30 bg-base-100 text-primary hover:bg-secondary"
        type="button"
        aria-expanded={isOpen}
      >
        <Share2 size={18} />
        Share Event
      </button>

      {isOpen && (
        <div className="mt-3 rounded-[14px] border border-base-300 bg-base-100 p-4 shadow-lift">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-base-content">
              Share this event
            </h3>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close share options"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleFacebookShare}
              className="flex flex-col items-center gap-2 rounded-lg border border-base-300 bg-base-200/60 p-3 text-primary transition hover:border-primary/40 hover:bg-secondary"
            >
              <Share2 size={21} />
              <span className="text-xs font-medium">Facebook</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center gap-2 rounded-lg border border-base-300 bg-base-200/60 p-3 text-success transition hover:border-primary/40 hover:bg-secondary"
            >
              <MessageCircle size={21} />
              <span className="text-xs font-medium">WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleMessengerShare}
              className="flex flex-col items-center gap-2 rounded-lg border border-base-300 bg-base-200/60 p-3 text-info transition hover:border-primary/40 hover:bg-secondary"
            >
              <Smartphone size={21} />
              <span className="text-xs font-medium">Messenger</span>
            </button>

            <button
              type="button"
              onClick={handleXShare}
              className="flex flex-col items-center gap-2 rounded-lg border border-base-300 bg-base-200/60 p-3 text-base-content transition hover:border-primary/40 hover:bg-secondary"
            >
              <XLogo size={19} />
              <span className="text-xs font-medium">X</span>
            </button>

            <button
              type="button"
              onClick={handleTelegramShare}
              className="flex flex-col items-center gap-2 rounded-lg border border-base-300 bg-base-200/60 p-3 text-info transition hover:border-primary/40 hover:bg-secondary"
            >
              <Send size={21} />
              <span className="text-xs font-medium">Telegram</span>
            </button>

            <button
              type="button"
              onClick={handleLinkedInShare}
              className="flex flex-col items-center gap-2 rounded-lg border border-base-300 bg-base-200/60 p-3 text-primary transition hover:border-primary/40 hover:bg-secondary"
            >
              <Users size={21} />
              <span className="text-xs font-medium">LinkedIn</span>
            </button>

            <button
              type="button"
              onClick={handleEmailShare}
              className="flex flex-col items-center gap-2 rounded-lg border border-base-300 bg-base-200/60 p-3 text-base-content transition hover:border-primary/40 hover:bg-secondary"
            >
              <Mail size={21} />
              <span className="text-xs font-medium">Email</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-2 rounded-lg border border-base-300 bg-base-200/60 p-3 text-success transition hover:border-primary/40 hover:bg-secondary"
            >
              <Copy size={21} />
              <span className="text-xs font-medium">Copy Link</span>
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="flex flex-col items-center gap-2 rounded-lg border border-base-300 bg-base-200/60 p-3 text-primary transition hover:border-primary/40 hover:bg-secondary"
            >
              <LinkIcon size={21} />
              <span className="text-xs font-medium">More</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
