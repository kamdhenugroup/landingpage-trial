# AutoGlow package landing pages

Static site for Meta ads. No build step.

Pages
  /                          All packages
  /packages/insta-shine
  /packages/complete-detailing
  /packages/ceramic-coating
  /packages/window-tinting
  /packages/graphene-coating
  /packages/luxury-express-service
  /packages/vinyl-wrap
  /packages/ppf
  /packages/colour-ppf
  /packages/supreme

Flow: ad -> package page -> name + email -> button unlocks -> WhatsApp (+91 98250 20746)
opens with the package, name and email written in -> user taps send.

Deploy
  1. vercel.com > Add New > Project > import this folder (or run `vercel` inside it).
     Framework preset: Other. No build command. Output directory: leave empty.
  2. Optional lead emails: in Vercel > Settings > Environment Variables add RESEND_API_KEY
     (and LEAD_FROM with a sender on your verified Resend domain). Without it, WhatsApp still works.
  3. Optional Meta Pixel: put your Pixel ID in assets/config.js (metaPixelId). Fires PageView,
     ViewContent and Lead (on button tap).

Ad links: add UTM tags, e.g.
  https://<domain>/packages/ceramic-coating?utm_source=meta&utm_campaign=ceramic&utm_content=reel1

Media: see media/README.txt.
