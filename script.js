const ACCESS_TOKEN = 'BQDAQ76NvIekW9M9-Sw-NlFwggwz_qRIH9gAYxt9n8R9C8sxQtorxJ8wHrZfpLA6PL8d0q0FJcerteHAFYntwEyo9unMDi8uJ1PhTufNjRdhLx5lNd7-Zp7yHeyut59dqmK_iTyrp4UFSCVdRchL2D5q5Fn97S4GHTGSaCk3d8wM8yLPwgiUefEfwc7WgcsAYwqTdx4ifwyyl3wLFc0","token_type":"Bearer","expires_in":3600,"refresh_token":"AQBJH6ZAECLhhdGA_pM7mKFsniTIY6Lwca9INKGi5vuZCNFjjJp_92-1ejXpboX858x_5YuV2n_ygjvnAV0MaDzoy3e6Y_NewhdAeJf-_CBX8W0qfYVehvFpcGIRKJwLXCA';


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
