# Agora Marketplace: Comprehensive Project Overview

## Executive Summary
**Agora** is a modernized, localized directory and lead-generation marketplace designed to connect homeowners in Nova Scotia with trusted, top-rated local professionals (e.g., Plumbers, Electricians, HVAC specialists). Built with a focus on trust, transparency, and premium user experience, Agora centralizes fragmented service data into a sleek, highly accessible, and geographically aware web application.

---

## Core Value Proposition
Finding reliable tradespeople is often a frustrating, opaque process. Agora solves this by:
1. **Curating Trust:** Highlighting verified professionals through BBB Accreditations, Efficiency Nova Scotia partnerships, and internal vetting.
2. **AI-Synthesized Insights:** Providing users with an "Agora Trust Report" and Reputation Score to make informed hiring decisions quickly.
3. **Geographic Precision:** Allowing users to find professionals exactly where they live using an interactive map and localized service zones.

---

## Key Features & Capabilities

### 1. Dynamic Routing & SEO Architecture
*   **Hierarchical Structure:** The platform utilizes dynamic Next.js routing (`/[category]/[region]/[slug]`) to generate thousands of localized, SEO-optimized landing pages instantly (e.g., `/plumbing/annapolis-valley`).
*   **Search Engine Visibility:** Structured data (Schema.org), semantic HTML5, and proper meta-tagging are implemented automatically on every profile and hub page to dominate local search results.

### 2. Interactive Geographic Mapping
*   **Smart FSA Mapping:** Using a custom dictionary mapping Nova Scotia's Forward Sortation Areas (FSAs) to coordinates, the platform visually clusters service providers.
*   **Seamless Integration:** The interactive Leaflet map seamlessly responds to user searches, automatically adjusting the camera and clustering pins based on the selected region or searched postal code.

### 3. Premium SaaS-Grade UI/UX
*   **Aesthetic Philosophy:** The platform employs a "Light Blue-Gray" (`#E4E9F0`) and Deep Slate color palette, establishing a clean, professional, and trustworthy brand identity.
*   **Floating Card Interfaces:** Business profiles and regional hubs are presented using modern overlapping grid layouts, soft shadows, and micro-interactions to create a frictionless browsing experience.
*   **Mobile-First Design:** Fully responsive grid systems ensure the marketplace is just as powerful on a smartphone as it is on a desktop.

### 4. Robust Trust & Verification Badging
*   **High-Contrast Verification:** Critical trust signals (BBB A+ Verified, Efficiency NS Partner, Agora Verified Professional) are displayed prominently using high-contrast, color-coded pill badges on both search cards and business profiles.
*   **Transparent Methodology:** Users can easily access the "How it's built" methodology behind the AI-synthesized trust scores, reinforcing the platform's commitment to transparency.

### 5. Advanced Search & Filtering
*   **Frictionless Search:** A smart search bar allows users to input partial names, full postal codes, or cities, instantly normalizing the data and routing them to the correct geographic hub without throwing blocking errors.
*   **Dynamic Filtering:** Users can filter professionals based on minimum AI Reputation Scores and specific localized zones directly from the directory interface.

---

## Technical Stack

Agora is built on a modern, high-performance web stack designed for scale:

*   **Frontend Framework:** Next.js (App Router) & React
*   **Styling & UI:** Tailwind CSS, Lucide React (Icons), Custom Glassmorphism effects
*   **Database & Backend:** Supabase (PostgreSQL), utilizing both Server and Client Components for optimal data fetching and rendering speeds.
*   **Mapping Engine:** React-Leaflet (dynamically imported to ensure Server-Side Rendering compatibility)
*   **Version Control:** Git & GitHub

---

## Future Roadmap & Scalability
The underlying architecture of Agora is designed to scale horizontally. While currently focused on Nova Scotia and key trades like plumbing, the dynamic routing and robust database schema allow for rapid expansion into new provinces, categories, and service types with minimal engineering overhead.
