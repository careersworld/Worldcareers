/**
 * Create Test Auth Users Script
 * 
 * This script creates test authentication users in Supabase
 * Run with: npm run create-users
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load .env.local file manually
function loadEnv() {
    try {
        const envPath = join(process.cwd(), '.env.local')
        const envFile = readFileSync(envPath, 'utf-8')
        const envVars: Record<string, string> = {}

        envFile.split('\n').forEach(line => {
            const trimmed = line.trim()
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=')
                if (key && valueParts.length > 0) {
                    envVars[key.trim()] = valueParts.join('=').trim()
                }
            }
        })

        return envVars
    } catch (error) {
        console.error('❌ Could not read .env.local file!')
        console.error('Make sure .env.local exists in the project root')
        process.exit(1)
    }
}

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables in .env.local!')
    console.error('Make sure you have:')
    console.error('  - NEXT_PUBLIC_SUPABASE_URL')
    console.error('  - SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

// Create admin client (can manage auth users)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

// Test users to create
const testUsers = [
    {
        email: 'admin@worldcareers.rw',
        password: 'Admin123!',
        role: 'admin',
        metadata: {
            first_name: 'Admin',
            last_name: 'User'
        }
    },
    {
        email: 'company@techcorp.rw',
        password: 'Company123!',
        role: 'company',
        metadata: {
            company_name: 'Tech Corp Rwanda'
        }
    },
    {
        email: 'candidate@example.com',
        password: 'Candidate123!',
        role: 'candidate',
        metadata: {
            first_name: 'John',
            last_name: 'Doe'
        }
    }
]

async function createAuthUsers() {
    console.log('🚀 Creating test auth users...\n')

    for (const user of testUsers) {
        try {
            console.log(`📝 Creating ${user.role} user: ${user.email}`)

            // Create the auth user
            const { data, error } = await supabase.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true, // Auto-confirm email
                user_metadata: {
                    role: user.role,
                    ...user.metadata
                }
            })

            if (error) {
                console.error(`   ❌ Error: ${error.message}`)
            } else {
                console.log(`   ✅ Created successfully!`)
                console.log(`   📋 User ID: ${data.user.id}`)
                console.log(`   🔑 Email: ${user.email}`)
                console.log(`   🔒 Password: ${user.password}`)
                console.log(`   👤 Role: ${user.role}`)
            }
            console.log('')
        } catch (err) {
            console.error(`   ❌ Unexpected error:`, err)
            console.log('')
        }
    }

    console.log('✅ Done!\n')
    console.log('📋 Test Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    testUsers.forEach(user => {
        console.log(`\n${user.role.toUpperCase()}:`)
        console.log(`  Email: ${user.email}`)
        console.log(`  Password: ${user.password}`)
    })
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🎉 You can now login at http://localhost:3000/login')
}

// Run the script
createAuthUsers().catch(console.error)
