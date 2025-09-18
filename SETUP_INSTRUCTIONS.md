# Setup Instructions for AI Clinical Decision Support

## Step 1: Run the Database Schema
Run the script `scripts/009_simple_working_schema.sql` to create the minimal database structure.

## Step 2: Create Sample Doctors Manually

Since Supabase doesn't allow direct insertion into auth.users, you need to create the sample doctors through the Supabase Auth Admin panel:

### Go to Supabase Dashboard → Authentication → Users → Add User

**Doctor 1:**
- Email: `doctor1@clinic.com`
- Password: `password123`
- Email Confirm: ✅ (check this box)

**Doctor 2:**
- Email: `doctor2@clinic.com`  
- Password: `password123`
- Email Confirm: ✅ (check this box)

## Step 3: Verify Setup
After creating the users, the trigger will automatically create doctor profiles in the doctors table.

## Login Credentials
- **Username:** `doctor1@clinic.com` | **Password:** `password123`
- **Username:** `doctor2@clinic.com` | **Password:** `password123`

## That's it!
Your minimal clinical decision support system is ready with just doctors and patients data.
