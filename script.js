const ACCESS_TOKEN = 'BQBAxMQhwaPbdxH4hAMTyMmj4nzDVVw-Cq4MRpw-uxres0azaG3rZeolQ3Nu5nXzR3LYKpCq3JtMrBFb6kRN3fQHot3rbPabtGr9scXPf2hq4nuekAiSe1WeKDkz0yRgHfQKd0PIgZLBl1OKqmtyxkIfRLGD688d1c6d99kWlehoxJy2tofydauLTTiXN0Z4t4cmmGCDFpqrnVdY_JI';

async function fetchCurrentlyPlaying() {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.item) {
                document.getElementById('track-name').textContent = data.item.name;
                document.getElementById('artist-name').textContent = data.item.artists.map(artist => artist.name).join(', ');
                document.getElementById('album-name').textContent = data.item.album.name;
                document.getElementById('album-art').src = data.item.album.images[0].url;
            } else {
                document.getElementById('track-info').innerHTML = '<p>No track is currently playing.</p>';
            }
        } else {
            throw new Error('Failed to fetch currently playing track');
        }
    } catch (error) {
        console.error('Error fetching currently playing track:', error);
        document.getElementById('track-info').innerHTML = '<p>Error fetching track information.</p>';
    }
}

async function fetchRecentlyPlayed() {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const recentTracksContainer = document.getElementById('recent-tracks');
            recentTracksContainer.innerHTML = '';

            if (data && data.items) {
                data.items.forEach(item => {
                    const trackElement = document.createElement('div');
                    trackElement.classList.add('track');
                    trackElement.innerHTML = `
                        <img src="${item.track.album.images[1].url}" alt="${item.track.name}" />
                        <div class="track-info">
                            <strong>${item.track.name}</strong> by ${item.track.artists.map(artist => artist.name).join(', ')}
                        </div>
                    `;
                    recentTracksContainer.appendChild(trackElement);
                });
            } else {
                recentTracksContainer.innerHTML = '<p>No recent tracks found.</p>';
            }
        } else {
            throw new Error('Failed to fetch recently played tracks');
        }
    } catch (error) {
        console.error('Error fetching recently played tracks:', error);
        document.getElementById('recent-tracks').innerHTML = '<p>Error fetching recent tracks.</p>';
    }
}

// Fetch currently playing track and recently played tracks on page load
fetchCurrentlyPlaying();
fetchRecentlyPlayed();

// Refresh automatically every minute (60000 milliseconds)
setInterval(fetchCurrentlyPlaying, 30000);

// Refresh button functionality
document.getElementById('refresh-button').addEventListener('click', () => {
    fetchCurrentlyPlaying();
    fetchRecentlyPlayed();
});
