const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: '696df5f2c5974a90136cb856', roles: ['admin'] }, '89e34a12f7b8c9d01e23456789abcdef0123456789abcdef0123456789abcde', { expiresIn: '1y' });
console.log('Token:', token);

async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/gyms/6a4ba80a3ea3e3a8b2fbc4f6', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ isPremium: true })
        });
        const updateData = await res.json();
        console.log('Update Response:', updateData);

        const res2 = await fetch('http://localhost:5000/api/gyms', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const listData = await res2.json();
        const gym = listData.find(g => g._id === '6a4ba80a3ea3e3a8b2fbc4f6');
        console.log('Gym from GET:', gym.isPremium);
    } catch (e) {
        console.error(e);
    }
}
test();
