
# Supabase Setup SQL Script

This script will set up your Supabase database correctly for the Product and Partner Dashboard.

**Instructions:**

1.  Navigate to the **SQL Editor** in your Supabase project dashboard.
2.  **Delete any old `products` tables** to avoid conflicts.
3.  Click **"+ New query"**.
4.  Copy the entire content of this file and paste it into the Supabase SQL Editor.
5.  Click the **"RUN"** button.

This will:
- Create the `products` and `partners` tables.
- Establish a relationship between them.
- **Enable Row Level Security (RLS)** on both tables.
- Create security policies to allow logged-in users to manage data.
- Insert sample data for the application to use.

---

```sql
-- Create the table for top-level products
CREATE TABLE IF NOT EXISTS public.products (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamptz NOT NULL DEFAULT now(),
    name text NOT NULL,
    description text,
    icon_url text,
    CONSTRAINT products_pkey PRIMARY KEY (id)
);

-- Create the table for partners, with a link to a product
CREATE TABLE IF NOT EXISTS public.partners (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamptz NOT NULL DEFAULT now(),
    product_id uuid NOT NULL,
    name text NOT NULL,
    status text NOT NULL,
    join_date timestamptz NOT NULL,
    contact_person jsonb NOT NULL,
    description text,
    logo_url text,
    CONSTRAINT partners_pkey PRIMARY KEY (id),
    CONSTRAINT partners_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);


-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Enable RLS for both tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Drop old policies to prevent conflicts
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.products;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.partners;

-- Create policies for 'products' table
CREATE POLICY "Allow authenticated read access" ON public.products
FOR SELECT TO authenticated USING (true);

-- Create policies for 'partners' table (allow full CRUD for logged-in users)
CREATE POLICY "Allow all access for authenticated users" ON public.partners
FOR ALL TO authenticated USING (true);


-- =============================================
-- SEED DATA (Sample Products and Partners)
-- =============================================
DO $$
DECLARE
    motor_product_id uuid;
    medical_product_id uuid;
    marine_product_id uuid;
    pet_product_id uuid;
BEGIN
   -- Clear existing data to prevent duplicates on re-run
   TRUNCATE public.products, public.partners RESTART IDENTITY CASCADE;

   -- Insert Products and get their IDs
   INSERT INTO public.products (name, description, icon_url) VALUES
   ('Motor', 'Products related to vehicle insurance and protection.', 'https://i.imgur.com/g892g4S.png'),
   ('Medical', 'Health and wellness insurance products for individuals and groups.', 'https://i.imgur.com/f8u2L5g.png'),
   ('Marine', 'Insurance coverage for maritime and shipping activities.', 'https://i.imgur.com/k2tNc6b.png'),
   ('Pet', 'Insurance plans for the health and well-being of pets.', 'https://i.imgur.com/eB3fD3v.png')
   RETURNING id INTO motor_product_id, medical_product_id, marine_product_id, pet_product_id;

   -- Insert Partners associated with the Products
   INSERT INTO public.partners (product_id, name, status, join_date, contact_person, description, logo_url) VALUES
   -- Motor Partners
   (motor_product_id, 'AutoGuard Solutions', 'Active', '2023-01-15T10:00:00Z', '{"name": "Alice Johnson", "email": "alice@autoguard.com"}', 'Leading provider of comprehensive auto insurance.', 'https://i.imgur.com/sC22L2A.png'),
   (motor_product_id, 'Speedy Claims Inc.', 'Onboarding', '2024-05-01T11:00:00Z', '{"name": "Bob Williams", "email": "bob@speedyclaims.com"}', 'Specializes in fast and efficient claims processing for auto repairs.', 'https://i.imgur.com/NKyYJgL.png'),
   (motor_product_id, 'Vintage Car Club', 'Inactive', '2022-03-20T09:00:00Z', '{"name": "Charlie Brown", "email": "charlie@vintagecc.com"}', 'A previous partner specializing in classic car insurance.', 'https://i.imgur.com/5lOVG0I.png'),
   
   -- Medical Partners
   (medical_product_id, 'HealthFirst Network', 'Active', '2022-11-10T14:30:00Z', '{"name": "Diana Miller", "email": "diana@healthfirst.com"}', 'A network of hospitals providing cashless services.', 'https://i.imgur.com/2qK1Hgr.png'),
   (medical_product_id, 'Wellness Corp', 'Active', '2023-08-22T16:00:00Z', '{"name": "Eve Davis", "email": "eve@wellnesscorp.com"}', 'Corporate wellness and group health insurance plans.', 'https://i.imgur.com/dJdf86b.png'),

   -- Marine Partners
   (marine_product_id, 'SeaLegs Assurance', 'Active', '2023-02-28T18:00:00Z', '{"name": "Frank Green", "email": "frank@sealegs.com"}', 'Specialists in marine cargo and hull insurance.', 'https://i.imgur.com/cEaXo2l.png'),

   -- Pet Partners
   (pet_product_id, 'Paws & Claws Vet', 'Onboarding', '2024-04-10T12:00:00Z', '{"name": "Grace Hill", "email": "grace@pawsclaws.com"}', 'A chain of veterinary clinics joining our network.', 'https://i.imgur.com/RklbQ7S.png'),
   (pet_product_id, 'The Pet Emporium', 'Active', '2023-06-05T15:00:00Z', '{"name": "Heidi White", "email": "heidi@petemporium.com"}', 'Retail partner for pet wellness products and food.', 'https://i.imgur.com/7bqsJba.png');
END $$;
```
