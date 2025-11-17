# WhatsApp Community Setup Instructions

## Update WhatsApp Community Link

To add your WhatsApp community link to job sharing:

1. Open `components/job-share-buttons.tsx`
2. Find this line (around line 22):
   ```typescript
   const whatsappCommunityLink = 'https://chat.whatsapp.com/YOUR_COMMUNITY_LINK'
   ```
3. Replace `YOUR_COMMUNITY_LINK` with your actual WhatsApp community invite code

## Example:
If your WhatsApp community link is: `https://chat.whatsapp.com/ABC123XYZ`

Change the line to:
```typescript
const whatsappCommunityLink = 'https://chat.whatsapp.com/ABC123XYZ'
```

## WhatsApp Message Format

When users share a job via WhatsApp, they will see:

```
[Company name] is hiring [job name], Location: [location], Opportunity type: [job type]

Apply now: [application link]

Follow WhatsApp community: [your community link]
```

## Company Logo in WhatsApp Preview

The company logo will automatically appear in WhatsApp message previews because:
- Open Graph meta tags are set with `og:image` using the company logo
- WhatsApp reads these meta tags to show rich previews
- Make sure company logos are uploaded when creating jobs in the admin panel

## Testing

1. Share a job via WhatsApp
2. Paste the link in WhatsApp
3. Wait a few seconds for the preview to load
4. You should see:
   - Company logo as the preview image
   - Job title as the main text
   - Company name and location in the description
