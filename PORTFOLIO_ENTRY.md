# Add WinLine to [kaddev.vercel.app](https://kaddev.vercel.app/)

Your portfolio repo is not in this workspace, so use the snippet below in your Next.js **projects** data (same shape as Campus Marketplace, Meditrack Pro, etc.).

## Suggested short label

`FEATURED PROJECT` or `PRODUCT / LANDING`

## Special description (for card + detail page)

**WinLine** is a conversion-led landing product for football betting tips and booking codes. It pairs a trust-first, night-themed **glass UI** (hero orbs, stat highlights, code cards, testimonials, FAQ) with **real checkout**: **Paystack** in **GHS**, exposing **Mobile Money** (MTN, Vodafone, AirtelTigo) plus cards—so the flow matches how Ghanaian users actually pay. Built with **React**, **TypeScript**, and **Vite** for a fast, maintainable surface you can extend with a verification API later.

## One-liner (subtitle)

Football tips landing with Paystack Mobile Money, premium code gating, and a polished dark glass UI—React, TypeScript, Vite.

## Paste-ready object (adjust `liveUrl` + `image` after deploy)

```ts
{
  title: "WinLine",
  subtitle: "Football tips · Paystack · Mobile Money",
  description:
    "A conversion-led landing for daily tips and booking codes: Paystack checkout in GHS (MTN MoMo, Vodafone, AirtelTigo, cards), gated premium picks, testimonials, FAQ, and a glassmorphism dark UI. React, TypeScript, Vite—ready to wire to server-side payment verification.",
  tags: ["React", "TypeScript", "Vite", "Paystack"],
  liveUrl: "https://YOUR_DEPLOYMENT.vercel.app",
  repoUrl: "https://github.com/djayourikelvinatsu-hub/bet_site",
  featured: true,
  // image: "/projects/winline.jpg",
}
```

Replace `liveUrl` with your production URL when the app is deployed. Add a screenshot at `public/projects/winline.jpg` (or your asset path) for parity with your other case studies.
