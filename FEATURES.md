# Blocopoly — Features

## Blocopoly MVP

### Room & lobby

- Create a new room (generates a unique 6-character room ID)
- Save and load settings profiles (persisted in browser local storage)
- Share room via copyable link; auto-join on link visit
- View and manage in-lobby player list with host indicator
- Transfer host on host disconnect; close room if no players remain
- Browse public rooms list
- Join room via direct link or rooms list
- How to play guide (modal)
- User settings — set and persist display name

### Pre-game setup

- Configure game settings (starting balance, salary, house prices, max players, public/private)
- View players / player list
- Piece and colour selection (unique per room; host cannot start until all players have selected)
- Host starts game (validates 2–4 players, settings in range, all pieces selected)
- Server shuffles turn order and broadcasts initial game state; all clients navigate to game

### Standard gameplay

- 2–4 players
- Dice rolling with doubles (extra roll; 3 consecutive doubles → go to jail)
- Board movement with salary on passing or landing on GO
- Buy unowned properties; auto-auction on decline or insufficient funds
- Auction with 30-second timer, open bidding, highest bidder wins
- Rent collection (base, doubled for full block, scaled for airports and utilities)
- Build houses on complete unowned blocks (even-building rule, up to 5 per property)
- Mortgage and unmortgage properties
- Trading — propose, edit, accept, or cancel bilateral property and cash trades
- Jail — enter via Go-to-Jail cell or 3 doubles; leave via doubles, fine, or Get-Out-of-Jail-Free card
- Vacation — gain all money accumulated here but miss a turn on landing here
- Income tax and luxury tax cells
- Surprise and Community Chest card decks (move, gain/lose cash, jail, Get-Out-of-Jail-Free)
- Bankruptcy — prompt to raise funds; transfer assets to creditor or return to bank
- Game over when one player remains

---

## Upcoming Feature Drops (TBC)

### Additional Monopoly features

- Inheritances
- Business partnerships
- Property and rent discounts
- Economic surprises like inflation

### Cryptocurrency (cross-game currency) — Chester Coin

- Earn Chester Coins by winning games
- Trade Chester Coins between players
- In-game coin market
- Buy special abilities or cosmetic customisations for future games

### Socialist/Communist mode

- This mode lasts for 3 rounds.
- The State joins the game as an additional player (agent)
    - Gets to roll - collects high taxes on whoever's property it lands on and takes ownership of unowned properties
    - Starts of with starting salary
    - Anytime someone owes money to the bank, it goes to the state now
    - The state takes a percentage of any rent payments and spreads it equally among all other players
- You have the option to join the Revolution - a communal fund you contribute to anonymously in order to bring down the State. If the revolution fund exceeds a threshold based on number of players and game settings, the State gets overthrown. All State money gets distributed amongst the revolutionaries proportionally to their contributions.
- You can also side with the State. This results in reduced taxes and oligarchical benefits. By the end of the 3 rounds, the State's earnings will be distributed amongst the oligarchs proportionally to their contributions.
- This mode encourages more strategic, cooperative gameplay between the players with a high-risk, high-reward setting.

---
