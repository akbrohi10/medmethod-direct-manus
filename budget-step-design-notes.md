# Budget Step Reference Design Notes

## Key observations from reference screenshot:

### Foundation/Ignite Card (Tier 01):
- NO image — clean white card with border
- "TIER 01" label in muted teal/green color (not gray)
- Plan name "Foundation" is large bold text, left-aligned
- Price "$85/mo" is large, positioned far right on the SAME LINE as the plan name
- Tagline below plan name
- Billed total + initiation below tagline
- "See details" with chevron at bottom
- Simple rounded border, white background

### Transform/Transformation Card (Most Popular):
- Dark navy/charcoal background
- "★ Most Popular" badge is a small rounded pill/tag (green bg, gold text) positioned INSIDE the card, top-left
- NOT a full-width banner across the top
- Plan name left, price center-right
- Image on the RIGHT side, takes up about 30% width, full height of card content area
- Image has rounded corners on the right side
- Image is NOT cut off — it fills the space naturally

### Longevity Card (Tier 03):
- Dark olive/green background  
- "TIER 03" label in muted gold color
- Same layout as Transform — name left, price center, image right
- Image takes up right ~30% of card, full height
- Rounded corners on right side of image

### Key differences from current implementation:
1. Ignite has NO image (clean minimal card)
2. Badge on Transform is a PILL inside the card, not a full-width banner
3. Price is on the SAME ROW as plan name (not stacked above image)
4. Images span full height of the card content area (not below price)
5. Tier labels use colored text (teal for Tier 01, gold for Tier 03)
