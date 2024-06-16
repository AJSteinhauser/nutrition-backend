import axios from "axios";
import { Request, Router } from "express"; 
import { request } from "http";
import queryString from 'querystring'

export const spotifyRoute = Router()

const scope = ['user-read-private', 'user-top-read']


spotifyRoute.get('/', (req, res) => {
    //@ts-ignore
    res.send(req.session.access_token)
});

spotifyRoute.get('/auth', async (req, res) => {
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' + queryString.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        scope: scope,
        redirect_uri: process.env.SERVER_URL! + '/spotify/callback',
        state: state
    }));
});


spotifyRoute.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            queryString.stringify({
                error: 'state_mismatch'
        }));
    }
    else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: process.env.SERVER_URL! + '/spotify/callback',
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                //@ts-ignore
                'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
            },
            json: true
        };

        axios.post(authOptions.url, authOptions.form, { headers: authOptions.headers }).then((response) => {
            //@ts-ignore
            req.session.access_token = response.data.access_token
            res.json(response.data)
        }).catch((error) => {
            //@ts-ignore
            req.session.access_token = null
            res.send("Log in failed")
        });
    }
})


const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

