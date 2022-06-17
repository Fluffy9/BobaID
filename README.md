# BobaID
The social authentication layer on Boba Network. Connect to oAuth providers such as Github, HumanNode, Discord and others to access Sybil protected Dapps

* UI/Documentation (This repo)
* [Server](https://github.com/Fluffy9/BobaID-Server)
* [Contracts](https://github.com/Fluffy9/BobaID-Contracts)
* [Website](https://fluffy9.github.io/BobaID/#/)


## Why
For NFT mints and other decentralized applications, dealing with scalpers is complicated. It's very easy to generate a thousand ethereum addresses, but it's a lot more effort to create a thousand Facebook accounts for example. Something as simple as requiring a social account connection cuts down some of the bot accounts. 

There are a lot of different oAuth providers that can be used with varying levels of difficulty to fake. There are also some providers that offer complete sybil protection. Having this be a seperate, interoperable application means that developers of the next airdrop or NFT mint can simply integrate BobaID and get back to focusing on building their project. 

## How It Works
Boba ID is bringing oAuth to the blockchain.
There are 3 aspects to this application. 
1. The Client UI
2. The Server
3. The Contracts

When a user wants to register with an oAuth provider, Github for example, they first visit the Client UI. They will click on the Github icon which will send them to Github's authorization flow. 

After logging in with Github, the user is redirected back to the Client UI with an [authorization code](https://www.oauth.com/oauth2-servers/server-side-apps/authorization-code/#:~:text=The%20authorization%20code%20is%20a,approve%20or%20deny%20the%20request.) query parameter. Now that we are back on the Client UI with the user's authorization code, we will save it to the blockchain. The user will be prompted to complete a transaction with the our oAuthGithub contract.

```
    function setUser(string memory _code) public {
        bool isUnset = unauthenticated[_code] == address(0);
        bool weekOld = ((unauthenticatedTimestamp[_code] + 7 days) < block.timestamp);
        require( isUnset || weekOld, "Code is already set");
        unauthenticatedTimestamp[_code] = block.timestamp;
        unauthenticated[_code] = msg.sender;
    }
```

The `setUser` function to store the authorization code with the user's address in a mapping called `unauthenticated`. A code can only be assigned to one address at a time.

Now that the user's transaction has succeeded and the authorization code has been stored with their address, we will prompt them to complete one more transaction. We will have them "Prove" their account. The client UI will be ask for a piece of information about their account (their Github account ID in this case) which is the claim for the `proveUser` function. Then, the "Prove" transaction will send the authorization code associated with the user's address to the off-chain server using [Turing](https://docs.boba.network/turing). 

```
    function proveUser(uint256 _claim, string memory _code) public returns (bool) {
        // Prove stuff
        require(unauthenticated[_code] == msg.sender, "You are only allowed to prove yourself");
        bytes memory encRequest = abi.encodePacked(_code);
        bytes memory encResponse = turing.TuringTx(url, encRequest);
        uint256 id = abi.decode(encResponse,(uint256));
        require(id == _claim, "The claimed ID doesn't match");
        authenticatedUsers[id] = msg.sender;
        unauthenticated[_code] == address(0);
        emit Proved(msg.sender, id);
    }
```

The server will trade the authorization code for the [access token](https://www.oauth.com/oauth2-servers/access-tokens/), which can be used to perform actions using the user's account. In particular, it will use the access token to get their Github account ID. 

The account ID returned to the contract will then be compared to the account ID the user submitted. If they are the same, then the account is proven to be associated with the user's address

## Is Storing the Authorization Code On-Chain a Bad Idea?

While sending the authorization code to the contract unencrypted does mean it's publicly accessible, it's not a problem in this case. The [client_secret](https://www.oauth.com/oauth2-servers/client-registration/client-id-secret/) is needed to get the access token from the authorization code, and the client_secret is only stored on the server. The authorization code is also single use. 

## Preventing Front-running

The general goal here is to tie infomation unique to your social account to your wallet address. What's preventing a malicious actor from front-running your transaction and using your authorization code with their address? This is what inspired a 2 step transaction proccess. 

The first transaction ties the authorization code to your address. Front running this is useless because you can only prove your own address, so the original user won't send the second transaction (which would fail). The malicious actor doesn't have the information required to prove since it's not their account. 

## Isn't My Social Account ID Now Public On The Blockchain? 

Yes, your account ID is stored unencrypted on the blockchain in connection with your address. I don't see an issue with this since your account ID is already public. Perhaps you might not want your social account tied to your wallet address for some reason. I guess this could be addressed in a future version if it becomes a highly requested feature. 

## How To Implement It Into Your Dapp

So you're making a airdrop and you want to ensure that you only airdrop to users with a Github account?

Every address within the public `authenticatedUsers` mapping is tied to a single Github account. 
1. Have your users connect their Github account to BobaID.
2. Check that their address is in the authenticatedUsers list before allowing them access to your smart contract/user interface. 

Because the mapping is indexed by the account ID and not the user address, this might be a bit annoying. Events are triggered for every proven account, so you can retrieve all the account IDs from emitted events. A subgraph will be created to make this more convenient. 

Once you get the account ID from the events, you will still want to rely on reading the `authenticatedUsers` mapping directly. There is nothing stopping a user from changing the address connected to their account. The only restriction is that there can just be one address connected at a time.

## Client UI Setup (Docker)

After git clone, modify the .env.example file
rename it to .env

### Build the image
```
docker build . -t boba-id
```

### Run the image
```
docker run -p 8080:8080 -it --name BobaID boba-id
```

## Client UI Setup (Development)

After git clone, open the /store/index.js file. 
Replace all instances of `process.env` with your own values.

### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
