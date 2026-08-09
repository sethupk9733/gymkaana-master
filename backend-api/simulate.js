const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: '696df5f2c5974a90136cb856', roles: ['admin'] }, '89e34a12f7b8c9d01e23456789abcdef0123456789abcdef0123456789abcde', { expiresIn: '1y' });

async function simulate() {
    // 1. Fetch all gyms
    let res = await fetch('http://localhost:5000/api/gyms', { headers: { Authorization: `Bearer ${token}` } });
    let gyms = await res.json();
    let mighty = gyms.find(g => g.name === 'Mighty Fitness Club');
    console.log('Before update:', mighty.name, 'isPremium:', mighty.isPremium);

    // 2. Toggle premium
    const newValue = !mighty.isPremium;
    console.log('Sending PUT to update to:', newValue);
    res = await fetch(`http://localhost:5000/api/gyms/${mighty._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isPremium: newValue })
    });
    const updateResponse = await res.json();
    console.log('PUT Response status:', res.status, 'isPremium in response:', updateResponse.isPremium);

    // 3. Fetch all gyms again (like loadGyms)
    res = await fetch('http://localhost:5000/api/gyms', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
    gyms = await res.json();
    mighty = gyms.find(g => g._id === mighty._id);
    console.log('After reload:', mighty.name, 'isPremium:', mighty.isPremium);
}

simulate();
