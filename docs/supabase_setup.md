# Supabase Setup SQL Script

This script will set up your Supabase database correctly for the Insurance Product Dashboard application.

**Instructions:**

1.  Navigate to the **SQL Editor** in your Supabase project dashboard.
2.  Click **"+ New query"**.
3.  Copy the entire content of this file and paste it into the Supabase SQL Editor.
4.  Click the **"RUN"** button.

This will:
- Create the `products` table if it doesn't already exist.
- **Enable Row Level Security (RLS)**, which is crucial for protecting your data.
- Create a security policy to **allow logged-in users to read** the product data.
- Insert sample data for the application to use.

---

```sql
-- Create the table for insurance products if it doesn't exist
CREATE TABLE IF NOT EXISTS public.products (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamptz NOT NULL DEFAULT now(),
    name text NOT NULL,
    icon_url text,
    status text NOT NULL,
    underwriter jsonb NOT NULL,
    last_update timestamptz NOT NULL,
    category text NOT NULL,
    policy_code text NOT NULL,
    description text,
    key_features jsonb,
    CONSTRAINT products_pkey PRIMARY KEY (id)
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- 1. Enable Row Level Security on the 'products' table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing read policies if they exist, to prevent conflicts
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.products;
DROP POLICY IF EXISTS "Allow individual read access" ON public.products; -- old policy name

-- 3. Create a new policy that allows any authenticated user to view all products.
--    For a production app, you might restrict this further (e.g., to users of a certain role).
CREATE POLICY "Allow authenticated read access"
ON public.products
FOR SELECT
TO authenticated
USING (true);


-- =============================================
-- SEED DATA (Sample Insurance Policies)
-- =============================================
-- This will insert data only if the table is empty.
-- You can safely re-run this script without creating duplicate data.
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM public.products) THEN
      INSERT INTO public.products (name, icon_url, status, underwriter, last_update, category, policy_code, description, key_features) VALUES
      ('Comprehensive Motor Shield', 'https://i.imgur.com/g892g4S.png', 'Active', '{"name": "Alice Johnson", "email": "alice.j@example.com"}', '2024-05-20T10:00:00Z', 'Motor', 'MOT-001', 'All-in-one motor insurance covering accidents, theft, and third-party liability with roadside assistance.', '["24/7 Roadside Assistance", "Zero Depreciation Cover", "Theft Protection"]'),
      ('Global Health Guard', 'https://i.imgur.com/f8u2L5g.png', 'Active', '{"name": "Bob Williams", "email": "bob.w@example.com"}', '2024-05-18T14:30:00Z', 'Medical', 'MED-001', 'Comprehensive international health coverage for individuals and families, including hospitalization and critical illness.', '["Worldwide Coverage", "Cashless Hospitalization", "Maternity Benefits"]'),
      ('Marine Cargo Protect', 'https://i.imgur.com/k2tNc6b.png', 'Pilot', '{"name": "Charlie Brown", "email": "charlie.b@example.com"}', '2024-05-15T09:00:00Z', 'Marine', 'MAR-001', 'Specialized insurance for goods in transit over sea, protecting against loss or damage during shipment.', '["Port to Port Coverage", "War and Strike Risk Cover", "Container Protection"]'),
      ('Happy Paws Pet Care', 'https://i.imgur.com/eB3fD3v.png', 'In Review', '{"name": "Diana Miller", "email": "diana.m@example.com"}', '2024-05-21T11:00:00Z', 'Pet', 'PET-001', 'Complete health insurance for pets, covering veterinary visits, surgeries, and routine check-ups.', '["Accident and Illness Cover", "Vaccination and Wellness", "Lost Pet Assistance"]'),
      ('Legacy Travel Secure', 'https://i.imgur.com/zY9f3aN.png', 'Discontinued', '{"name": "Eve Davis", "email": "eve.d@example.com"}', '2023-12-01T18:00:00Z', 'Medical', 'MED-000', 'Older travel insurance product that has been replaced by the Global Health Guard policy.', '["Trip Cancellation", "Baggage Loss", "Emergency Medical"]');
   END IF;
END $$;
```