require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve spotifyApi access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', (req, res) => {
    const queryString = req.query.artist;
    spotifyApi.searchArtists(queryString)
        .then(data => {
            const artists = data.body.artists.items;
            res.render('artist-search-results', {queryString, artists});
        })
        .catch(err => {
            res.write('Error searching for artist:');
            res.write(err);
            res.send();
        });
});


app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            const albums = data.body.items;
            res.render('albums', {albums});
        })
        .catch(err => {
            res.write('Error getting artist albums:');
            res.write(err);
            res.send();
        });
});

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(data => {
            const tracks = data.body.items;
            res.render('tracks', {tracks});
        })
        .catch(err => {
            res.write('Error getting album tracks:');
            res.write(err);
            res.send();
        });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
