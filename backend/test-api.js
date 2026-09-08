const http = require('http');

const PORT = 5000;

function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : '';
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ status: res.statusCode, body: json });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

async function runApiTests() {
    console.log('--- STARTING BACKEND INTEGRATION API TESTS ---');

    try {
        // 1. Health Check
        const health = await request('GET', '/');
        console.log('1. Health check:', health.status, health.body.message);

        // 2. Admin Login
        const adminLogin = await request('POST', '/api/auth/login', {
            email: 'admin@storerating.com',
            password: 'AdminPass123!'
        });
        console.log('2. Admin Login:', adminLogin.status, adminLogin.body.user ? 'Success (Role: ' + adminLogin.body.user.role + ')' : adminLogin.body);
        const adminToken = adminLogin.body.token;

        // 3. Admin Dashboard Stats
        const adminStats = await request('GET', '/api/admin/dashboard', null, adminToken);
        console.log('3. Admin Dashboard Stats:', adminStats.status, adminStats.body);

        // 4. Admin Add New Store Owner User
        const newOwner = await request('POST', '/api/admin/users', {
            name: 'Second Store Owner Account Person',
            email: 'owner2@storerating.com',
            password: 'OwnerPass123!',
            address: '777 Commerce Boulevard, Suite 100',
            role: 'STORE_OWNER'
        }, adminToken);
        console.log('4. Admin Add STORE_OWNER:', newOwner.status, newOwner.body.user ? newOwner.body.user.name : newOwner.body);

        // 5. Admin Add Store
        const newStore = await request('POST', '/api/admin/stores', {
            name: 'Electronics & Gadgets Mega Store',
            email: 'gadgets@megastore.com',
            address: '777 Commerce Boulevard, Suite 100',
            ownerId: newOwner.body.user ? newOwner.body.user.id : null
        }, adminToken);
        console.log('5. Admin Add Store:', newStore.status, newStore.body.store ? newStore.body.store.name : newStore.body);

        // 6. User Signup (Validation check & creation)
        const userSignup = await request('POST', '/api/auth/register', {
            name: 'Brendan Eich Customer User Person',
            email: 'brendan@storerating.com',
            password: 'UserPass123!',
            address: '555 Silicon Valley Boulevard, Tech City'
        });
        console.log('6. Normal User Register:', userSignup.status, userSignup.body.user ? 'Success' : userSignup.body);
        const userToken = userSignup.body.token;

        // 7. Normal User Fetch Stores
        const userStores = await request('GET', '/api/stores', null, userToken);
        console.log('7. User Fetch Stores Count:', userStores.status, userStores.body.stores ? userStores.body.stores.length : userStores.body);

        // 8. Normal User Submit Rating (5 Stars)
        const targetStoreId = newStore.body.store ? newStore.body.store.id : 1;
        const ratingRes = await request('POST', '/api/ratings', {
            storeId: targetStoreId,
            rating: 5
        }, userToken);
        console.log('8. User Submit Rating:', ratingRes.status, ratingRes.body.rating ? 'Rating 5 Submitted' : ratingRes.body);

        // 9. Attempt duplicate rating (Should fail)
        const dupRating = await request('POST', '/api/ratings', {
            storeId: targetStoreId,
            rating: 4
        }, userToken);
        console.log('9. Duplicate Rating Check (Should be 400):', dupRating.status, dupRating.body.message);

        // 10. User Modify Existing Rating (Change 5 to 4)
        if (ratingRes.body.rating) {
            const modifyRes = await request('PUT', `/api/ratings/${ratingRes.body.rating.id}`, {
                rating: 4
            }, userToken);
            console.log('10. User Modify Rating:', modifyRes.status, modifyRes.body.message);
        }

        // 11. Store Owner Login & Dashboard Check
        const ownerLogin = await request('POST', '/api/auth/login', {
            email: 'owner2@storerating.com',
            password: 'OwnerPass123!'
        });
        const ownerToken = ownerLogin.body.token;
        const ownerDash = await request('GET', '/api/owner/dashboard', null, ownerToken);
        console.log('11. Owner Dashboard Stats:', ownerDash.status, ownerDash.body.stats);

        // 12. Store Owner Ratings List
        const ownerRatings = await request('GET', '/api/owner/ratings', null, ownerToken);
        console.log('12. Owner Ratings List Count:', ownerRatings.status, ownerRatings.body.ratings ? ownerRatings.body.ratings.length : ownerRatings.body);

        console.log('--- ALL API TESTS COMPLETED SUCCESSFULLY ---');
    } catch (err) {
        console.error('API Test Error:', err);
    }
}

runApiTests();
