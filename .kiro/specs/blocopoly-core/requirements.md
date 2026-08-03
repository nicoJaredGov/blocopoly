# Requirements Document

## Introduction

Blocopoly is a multiplayer Monopoly-style browser game built with Next.js (App Router), TypeScript, and WebSockets. This document covers the core feature set: the game lobby/room-management system and all standard Monopoly gameplay mechanics for 2–4 players.

The game uses a server-authoritative model where a WebSocket server holds the canonical game state and broadcasts updates to connected clients. Each client renders state received from the server; local actions are dispatched as messages to the server, which applies them and broadcasts the new state.

---

## Glossary

- **Client**: The browser-side Next.js application running on a player's device.
- **Server**: The WebSocket server that holds canonical game state and enforces game rules.
- **Room**: A game session with a unique ID, one host, and 1–3 other players.
- **Host**: The player who created the room. Responsible for starting the game and adjusting settings.
- **Player**: A participant in a Room, identified by a unique player ID.
- **Piece**: A unique visual token (shape + colour combination) representing a Player on the Board.
- **Board**: The 11×11 CSS-Grid game board containing 40 Cells arranged around the perimeter.
- **Cell**: A single position on the Board. May be a Property, a special space (GO, Jail, Vacation, Go-to-Jail), or a card space (Surprise, Community Chest, Tax).
- **Property**: Any Cell with a defined type — includes Residential, Airport, Power, and Water properties.
- **OwnableProperty**: A Property that can be purchased, mortgaged, and built on.
- **PropertyBlock**: A colour group of Residential OwnableProperties. Owning a full block enables house-building.
- **House**: A building placed on a Residential OwnableProperty to increase rent. Up to 5 houses per property.
- **Rent**: The amount a Player must pay to the owner of an OwnableProperty they land on.
- **Salary**: A fixed cash amount awarded to a Player each time they pass or land on GO.
- **Mortgage**: A state where an OwnableProperty is pledged for cash; no rent is collected while mortgaged.
- **Auction**: A blind or open bidding phase triggered when a Player declines to buy an OwnableProperty.
- **Trade**: A bilateral exchange of OwnableProperties and/or cash between two Players.
- **Jail**: A Board space that pauses a Player's turns until they pay a fine, roll doubles, or use a Get-Out-of-Jail card.
- **Vacation**: A Board space that has no effect other than pausing the Player's piece visually.
- **Bankruptcy**: The state where a Player's net worth (cash + mortgageable assets) cannot cover a debt. A bankrupt Player exits the game.
- **Game_State**: The complete, serialisable snapshot of a Room's game at a point in time — players, board, trades, stage, turn order, and settings.
- **Stage**: The current phase of gameplay within a turn — either `NORMAL` or `AUCTION`.
- **Settings_Profile**: A named, saved configuration of game settings (starting balance, salary, house prices, etc.) that can be reloaded.
- **GameStateReducer**: The pure function on the Server that takes a Game_State and a GameStateAction and returns a new Game_State.
- **GameStateAction**: A discriminated-union message type describing a player's intent (e.g., BUY_PROPERTY, ROLL_DICE).
- **Surprise_Card**: A card drawn from the Surprise deck that applies a random effect to a Player (move, gain/lose money, go to jail, etc.).
- **Community_Chest_Card**: A card drawn from the Community Chest deck that applies a random effect, typically involving money.

---

## Requirements

### Requirement 1: Room Creation

**User Story:** As a player, I want to create a new game room, so that I can host a Blocopoly game with my friends.

#### Acceptance Criteria

1. WHEN a player selects "Create Room" on the Home Page, THE Server SHALL generate a unique 6-character alphanumeric Room ID and register the player as the Host.
2. WHEN the Server confirms Room creation, THE Client SHALL navigate the Host to the Game Settings Page for that Room within 3 seconds.
3. WHEN a Room is created, THE Server SHALL set the Room's player list to contain only the Host and set the Room status to "waiting".
4. IF a Room creation request fails, THEN THE Client SHALL display an error message describing the failure and preserve any data the player entered, without navigating away from the Home Page.
5. IF the Server does not respond to a Room creation request within 10 seconds, THEN THE Client SHALL display a timeout error and remain on the Home Page.

---

### Requirement 2: Game Settings Configuration

**User Story:** As a host, I want to configure game settings before the game starts, so that I can customise the game for my group.

#### Acceptance Criteria

1. WHILE a Room is in the lobby stage, THE Host SHALL be able to set: starting player balance (500–100,000), salary amount (50–10,000), house prices per property block (50–5,000 each), maximum number of players (2–4), and whether the room is public or private.
2. WHEN the Host changes a setting, THE Server SHALL broadcast the updated settings to all players currently in the Room.
3. THE Game Settings Page SHALL display the current settings to all players in the Room within 1 second of a setting change being broadcast.
4. WHEN the game starts, THE Server SHALL validate that all settings are within the valid ranges defined in Criterion 1 before accepting the start request.
5. IF the Host submits settings with an out-of-range value, THEN THE Server SHALL reject the settings change, leave the previously accepted settings unchanged, and THE Client SHALL display a field-level validation error identifying the invalid field.

---

### Requirement 3: Settings Profile Management

**User Story:** As a host, I want to save and load game settings profiles, so that I can reuse preferred configurations without re-entering them each time.

#### Acceptance Criteria

1. WHEN the Host selects "Save Profile", THE Client SHALL prompt for a profile name (1–50 characters) and persist the current settings as a named Settings_Profile in browser local storage.
2. IF a Settings_Profile with the same name already exists, THEN THE Client SHALL prompt the Host to confirm overwrite or enter a new name before saving.
3. IF local storage is unavailable or write fails, THEN THE Client SHALL display an error indicating the profile could not be saved.
4. WHEN the Host selects "Load Profile", THE Client SHALL display a list of previously saved Settings_Profiles.
5. WHEN the Host selects a Settings_Profile from the list, THE Client SHALL populate all settings fields with the values from that profile without auto-submitting to the Server.
6. IF no Settings_Profiles have been saved, THEN THE Client SHALL display a message indicating that no profiles exist.
7. WHEN the Host selects "Delete" on a Settings_Profile, THE Client SHALL remove that profile from local storage and update the displayed list.

---

### Requirement 4: Room Sharing

**User Story:** As a host, I want to share a link to my room, so that invited players can join directly without searching for it.

#### Acceptance Criteria

1. WHEN a Room is created, THE Client SHALL generate a shareable URL containing the Room ID as a path segment or query parameter.
2. WHEN the Host selects "Copy Link", THE Client SHALL write the shareable URL to the system clipboard and display a confirmation message.
3. WHEN a player navigates to a shareable Room URL, THE Client SHALL attempt to join that Room automatically if the player has a saved display name.
4. IF the player has no saved display name, THEN THE Client SHALL prompt them to enter one before attempting to join the Room.
5. IF the Room referenced by the URL does not exist, THEN THE Client SHALL display a "Room not found" error and redirect the player to the Home Page within 3 seconds.
6. IF the Room referenced by the URL is full, THEN THE Client SHALL display a "Room is full" error and redirect the player to the Home Page within 3 seconds.

---

### Requirement 5: How to Play Guide

**User Story:** As a player, I want to view a "How to Play" guide, so that I can understand the rules before the game starts.

#### Acceptance Criteria

1. WHEN a player selects "How to Play", THE Client SHALL display a modal or dedicated page explaining Blocopoly's rules and game mechanics.
2. THE How_To_Play guide SHALL cover: turn structure, buying properties, building houses, collecting rent, trading, auctioning, going to jail, reaching vacation, salary collection, and bankruptcy.
3. WHEN the player dismisses the guide, THE Client SHALL return the player to the screen they were on before opening it.

---

### Requirement 6: In-Lobby Player List

**User Story:** As a player in a lobby, I want to see who is in the room with me, so that I know when everyone has joined and is ready.

#### Acceptance Criteria

1. WHILE a Room is in the lobby stage, THE Client SHALL display the current player list including each player's name, their join-order position, and a visual indicator identifying the Host.
2. WHEN a new player joins a Room, THE Server SHALL broadcast the updated player list to all players in the Room within 2 seconds.
3. WHEN a player voluntarily leaves a Room before the game starts, THE Server SHALL remove them from the player list and broadcast the updated list to remaining players within 2 seconds.
4. IF the Host voluntarily leaves before the game starts and other players remain, THEN THE Server SHALL transfer the Host role to the player with the earliest join-order position among the remaining players and broadcast the updated player list.
5. IF the Host voluntarily leaves before the game starts and no other players remain, THEN THE Server SHALL close the Room.
6. WHEN a player's WebSocket connection drops before the game starts, THE Server SHALL treat the disconnection as a voluntary leave and apply Criteria 3, 4, and 5 accordingly.

---

### Requirement 7: Public Room Browser

**User Story:** As a player, I want to browse public rooms, so that I can join an ongoing or pending game without needing a direct link.

#### Acceptance Criteria

1. WHEN a player selects "Browse Rooms" on the Home Page, THE Server SHALL respond within 3 seconds with a list of all public Rooms in the lobby stage, including for each Room: the host's name, the current player count, and the maximum player count.
2. WHEN a player selects a Room from the list that is not full, THE Client SHALL attempt to join that Room.
3. IF a player selects a Room from the list that is full, THEN THE Client SHALL display a "Room is full" message and not attempt to join.
4. WHEN a Room transitions from lobby to in-game, THE Server SHALL remove it from the public rooms list within 5 seconds.
5. IF the public rooms list is empty, THEN THE Client SHALL display a message indicating no public rooms are available.

---

### Requirement 8: Joining a Room

**User Story:** As a player, I want to join an existing room via a link or the rooms list, so that I can participate in a game hosted by someone else.

#### Acceptance Criteria

1. WHEN a player joins a Room, THE Server SHALL add the player to the Room's player list and broadcast the updated list to all players in the Room within 2 seconds.
2. WHEN a player successfully joins a Room, THE Client SHALL navigate that player to the Game Settings Page for that Room within 2 seconds.
3. IF a player attempts to join a Room that has reached its maximum player count, THEN THE Server SHALL reject the join request and THE Client SHALL display a rejection message indicating the room is full.
4. IF a player attempts to join a Room that is already in the in-game stage, THEN THE Server SHALL reject the join request and THE Client SHALL display a rejection message indicating the game is already in progress.
5. IF a player attempts to join using a Room ID that does not exist, THEN THE Server SHALL reject the join request and THE Client SHALL display a "Room not found" message.
6. IF a player who is already in a Room attempts to join the same Room again, THEN THE Server SHALL reject the duplicate join request without modifying the player list.

---

### Requirement 9: User Settings

**User Story:** As a player, I want to configure my display name and preferences, so that other players can identify me and the game reflects my preferences.

#### Acceptance Criteria

1. WHEN a player opens User Settings, THE Client SHALL display a display name input field pre-populated with the player's currently saved display name if one exists.
2. WHEN the player saves a display name that is between 1 and 20 characters, THE Client SHALL persist it in browser local storage and use it for all subsequent Room joins.
3. IF the player attempts to save a display name that is empty or exceeds 20 characters, THEN THE Client SHALL display a validation error and not persist the value.
4. IF a player attempts to create or join a Room without a saved display name, THEN THE Client SHALL block the action and prompt the player to enter a display name first.

---

### Requirement 10: Game Start

**User Story:** As a host, I want to start the game once all players are ready, so that we can begin playing.

#### Acceptance Criteria

1. WHEN the Host selects "Start Game", THE Server SHALL validate that: (a) there are between 2 and 4 players in the Room, (b) all settings are within valid ranges, and (c) every player has selected a piece and colour.
2. IF fewer than 2 players are in the Room when the Host attempts to start the game, THEN THE Server SHALL reject the start request and THE Client SHALL display a "Need at least 2 players" message.
3. IF validation fails for settings or piece selection, THEN THE Server SHALL reject the start request and THE Client SHALL display an error identifying which condition was not met.
4. WHEN the Server accepts a start request, THE Server SHALL determine turn order by randomly shuffling the player list, initialise the Game_State with the configured settings, the shuffled player list, and the game board, then broadcast the initial Game_State to all players.
5. WHEN the game starts, THE Client SHALL navigate all players in the Room to the Game Page.

---

### Requirement 11: Piece and Colour Selection

**User Story:** As a player, I want to choose a unique piece and colour before the game begins, so that I can be visually distinguished from other players on the board.

#### Acceptance Criteria

1. WHILE a Room is in the lobby stage, THE Client SHALL display a piece selection interface showing all available piece shapes and colours, with already-claimed combinations shown in a disabled state.
2. WHEN a player selects a piece-and-colour combination already claimed by another player in the same Room, THE Server SHALL reject the selection and THE Client SHALL display a "Combination already taken" message.
3. WHEN a player confirms their piece and colour selection, THE Server SHALL record both the piece and colour in the player's Player record and broadcast the updated player list to all players in the Room.
4. IF the Host attempts to start the game and any player has not confirmed both a piece and a colour, THEN THE Server SHALL reject the start request and THE Client SHALL indicate which players have not completed their selection.
5. WHEN a player who has claimed a piece-and-colour combination leaves the Room or disconnects, THE Server SHALL release that combination and make it available to other players.

---

### Requirement 12: Turn Structure and Dice Rolling

**User Story:** As a player, I want to roll dice on my turn and move my piece, so that the game progresses according to Monopoly rules.

#### Acceptance Criteria

1. WHEN it is a Player's turn, THE Server SHALL set that Player as the active player in the Game_State, reset that Player's consecutive doubles count to zero, and broadcast the updated Game_State.
2. WHEN the active Player rolls the dice, THE Server SHALL generate two random die values (each 1–6), advance the Player's `boardPosition` by the sum modulo 40 (wrapping past position 39 back to position 0), credit the Player's salary if the new `boardPosition` is numerically less than the pre-roll `boardPosition` indicating a pass through GO, and broadcast the updated Game_State.
3. IF the active Player rolls doubles, THEN THE Server SHALL increment that Player's consecutive doubles count by 1 and, after the landing Cell's effect has been fully resolved, grant the Player an additional roll — unless the Player's `inJail` flag is `true` or the consecutive doubles count has reached 3.
4. IF a Player rolls doubles and their consecutive doubles count reaches 3 in the same turn, THEN THE Server SHALL set the Player's `boardPosition` to the Jail Cell position (position 10), set `inJail` to `true`, skip landing Cell resolution, advance `currentPlayer` to the next non-bankrupt Player in turn order, and broadcast the updated Game_State.
5. WHEN the active Player's turn ends without rolling doubles, THE Server SHALL advance `currentPlayer` to the next non-bankrupt Player in turn order and broadcast the updated Game_State.
6. IF a Player who is not the active player attempts to roll the dice, or the active Player attempts to roll again after already rolling without having rolled doubles, THEN THE Server SHALL reject the roll request without modifying the Game_State.

---

### Requirement 13: Property Purchase

**User Story:** As a player who lands on an unowned OwnableProperty, I want the option to buy it, so that I can build my property portfolio.

#### Acceptance Criteria

1. WHEN a Player lands on an unowned OwnableProperty and their balance is greater than or equal to the property price, THE Server SHALL set the Stage to `PROPERTY_PURCHASE_DECISION` and broadcast a prompt for the Player to buy or decline, with a 30-second timeout.
2. WHEN the Player elects to buy the property within the timeout, THE Server SHALL deduct the property's price from the Player's balance, assign the Player as the owner, set the Stage to `AWAITING_ROLL` (or advance the turn), and broadcast the updated Game_State.
3. IF the Player's balance is less than the property price when they land on it, THEN THE Server SHALL set the Stage to `AUCTION` and initiate an Auction for that property without offering the buy option.
4. WHEN the Player declines to buy the property, THE Server SHALL set the Stage to `AUCTION` and initiate an Auction for that property.
5. IF the 30-second buy/decline timeout expires without a response, THEN THE Server SHALL treat the non-response as a decline and initiate an Auction for that property.

---

### Requirement 14: Rent Collection

**User Story:** As a property owner, I want rent automatically collected when another player lands on my property, so that owning properties provides a financial advantage.

#### Acceptance Criteria

1. WHEN a Player lands on an OwnableProperty owned by a different Player and the property is not mortgaged, THE Server SHALL deduct the current rent amount from the landing Player's balance and credit it to the owner's balance, then broadcast the updated Game_State.
2. WHEN a Player lands on an OwnableProperty owned by themselves, THE Server SHALL take no rent action.
3. WHILE an OwnableProperty is mortgaged, THE Server SHALL collect zero rent when a Player lands on it.
4. WHEN a Player owns all OwnableProperties in a PropertyBlock and those properties have no houses, THE Server SHALL apply double the base rent for all unimproved properties in that block.
5. WHEN a Player lands on an Airport OwnableProperty, THE Server SHALL charge rent equal to the configured airport base rent amount multiplied by the number of Airports the owner holds.
6. WHEN a Player lands on a Power or Water OwnableProperty and the owner holds only that one utility, THE Server SHALL charge rent equal to the configured single-utility multiplier applied to the landing Player's last dice roll total.
7. WHEN a Player lands on a Power or Water OwnableProperty and the owner holds both the Power and Water properties, THE Server SHALL charge rent equal to the configured full-utility-set multiplier applied to the landing Player's last dice roll total.
8. IF a Player's balance falls below zero after a rent deduction and they cannot cover the deficit, THEN THE Server SHALL initiate the bankruptcy process for that Player as defined in Requirement 24.

---

### Requirement 15: House Building

**User Story:** As a player who owns a full PropertyBlock, I want to build houses on my properties, so that I can increase the rent I collect.

#### Acceptance Criteria

1. WHILE a Player owns all OwnableProperties in a PropertyBlock and none of those properties are mortgaged, THE Client SHALL enable the "Build House" action for that block.
2. WHEN a Player builds a house on an OwnableProperty, THE Server SHALL increment the house count on that property by 1, deduct the configured house price from the Player's balance, and broadcast the updated Game_State to all connected players.
3. IF an OwnableProperty already has 5 houses, THEN THE Server SHALL reject further build requests for that property.
4. IF a Player's balance is less than the configured house price for that property's block, THEN THE Server SHALL reject the build request.
5. THE Server SHALL enforce that houses are built evenly across a PropertyBlock — a Player may not place a second house on a property until all properties in the block have at least one house.
6. IF a Player attempts to build a house that would violate the even-building rule, THEN THE Server SHALL reject the build request and leave the Game_State unchanged.
7. WHEN an OwnableProperty has houses and the owning Player does not own the full block, THE Server SHALL calculate rent as the base rent multiplied by the house count.
8. WHEN an OwnableProperty has houses and the owning Player owns all properties in the block, THE Server SHALL calculate rent as the base rent multiplied by the house count, then multiplied by 2.

---

### Requirement 16: Mortgage and Unmortgage

**User Story:** As a player, I want to mortgage properties to raise cash when I need it, so that I can avoid bankruptcy or fund other purchases.

#### Acceptance Criteria

1. WHEN a Player mortgages an OwnableProperty they own that is not currently mortgaged and has no houses, THE Server SHALL set `isMortgaged` to `true` on that property, credit the Player's balance with half the property's purchase price, and broadcast the updated Game_State.
2. IF an OwnableProperty has houses built on it, THEN THE Server SHALL reject the mortgage request and display an error indicating houses must be sold first.
3. WHEN a Player unmortgages an OwnableProperty they own that is currently mortgaged and their balance covers the unmortgage cost, THE Server SHALL set `isMortgaged` to `false`, deduct 110% of the property's mortgage value from the Player's balance, and broadcast the updated Game_State.
4. IF a Player's balance is insufficient to cover the unmortgage cost, THEN THE Server SHALL reject the unmortgage request and display an error indicating insufficient funds.
5. IF a Player attempts to mortgage a property they do not own, mortgage an already-mortgaged property, or unmortgage a non-mortgaged property, THEN THE Server SHALL reject the request without modifying the Game_State.

---

### Requirement 17: Salary Collection

**User Story:** As a player, I want to collect my salary when I pass or land on GO, so that I continue to accumulate income throughout the game.

#### Acceptance Criteria

1. WHEN a Player's `boardPosition` advances past or lands on position 0 (GO Cell) during normal movement, THE Server SHALL credit the Player's balance with the `goSalary` value from Game_Config and broadcast the updated Game_State to all players.
2. IF a Player is sent directly to Jail or any other Cell by a card or rule effect (bypassing GO), THEN THE Server SHALL leave the Player's balance unchanged — no salary is awarded for that movement.
3. IF a Player's movement in a single turn crosses position 0 more than once (only possible on very small boards), THE Server SHALL credit the salary once per crossing of position 0.

---

### Requirement 18: Jail Mechanics

**User Story:** As a player, I want clear rules for entering and leaving jail, so that the jail mechanic affects my strategy as expected.

#### Acceptance Criteria

1. WHEN a Player lands on the Go-to-Jail Cell, THE Server SHALL set the Player's `boardPosition` to the Jail Cell position (position 10), set `inJail` to `true`, set `jailTurnsElapsed` to 0, and broadcast the updated Game_State.
2. WHEN a Player is in Jail and rolls doubles on their turn, THE Server SHALL set `inJail` to `false`, advance the Player's `boardPosition` by the roll total, resolve the landing Cell normally, and end the turn without granting an additional roll for the doubles.
3. WHEN a Player is in Jail and does not roll doubles and `jailTurnsElapsed` is less than 2, THE Server SHALL increment `jailTurnsElapsed` by 1 and end the turn.
4. WHEN a Player is in Jail and does not roll doubles and `jailTurnsElapsed` equals 2 (third consecutive failed turn), THE Server SHALL deduct 50 monetary units from the Player's balance, set `inJail` to `false`, advance the Player's `boardPosition` by the roll total, resolve the landing Cell normally, and broadcast the updated Game_State.
5. WHEN a Player in Jail elects to pay the fine voluntarily before rolling and their balance is at least 50 monetary units, THE Server SHALL deduct 50 monetary units from the Player's balance, set `inJail` to `false`, and allow the Player to roll normally that turn.
6. IF a Player in Jail attempts to pay the fine voluntarily but their balance is less than 50 monetary units, THEN THE Server SHALL reject the payment request and require the Player to roll or resolve the debt before leaving Jail.

---

### Requirement 19: Vacation

**User Story:** As a player, I want landing on Vacation to be a safe, neutral event, so that it gives me a brief reprieve without penalty.

#### Acceptance Criteria

1. WHEN a Player lands on the Vacation Cell, THE Server SHALL end that Player's movement for the turn without modifying any other game state.
2. WHEN a Player lands on the Vacation Cell, THE Server SHALL NOT modify the Player's balance, `boardPosition` (beyond the landing itself), `inJail` flag, or any property state.

---

### Requirement 20: Tax Spaces

**User Story:** As a player, I want tax spaces to deduct money from me automatically, so that the board presents financial hazards beyond rent.

#### Acceptance Criteria

1. WHEN a Player lands on an Income Tax Cell, THE Server SHALL deduct the configured income tax amount from the Player's balance and broadcast the updated Game_State.
2. WHEN a Player lands on a Luxury Tax Cell, THE Server SHALL deduct the configured luxury tax amount from the Player's balance and broadcast the updated Game_State.
3. IF a Player's balance falls below zero after a tax deduction and the Player has no assets available for liquidation (no unmortgaged properties, no properties with houses), THEN THE Server SHALL initiate the bankruptcy process for that Player as defined in Requirement 24.

---

### Requirement 21: Surprise and Community Chest Cards

**User Story:** As a player, I want drawing Surprise and Community Chest cards to apply random effects, so that the game includes unpredictable events that affect strategy.

#### Acceptance Criteria

1. WHEN a Player lands on a Surprise Cell, THE Server SHALL draw the top Surprise_Card from the Surprise deck, apply its effect to the relevant Player or Game_State, and broadcast the updated Game_State.
2. WHEN a Player lands on a Community Chest Cell, THE Server SHALL draw the top Community_Chest_Card from the Community Chest deck, apply its effect, and broadcast the updated Game_State.
3. WHEN a Surprise or Community Chest deck is exhausted, THE Server SHALL immediately reshuffle all cards (excluding any Get-Out-of-Jail-Free cards currently held by players) back into that deck.
4. THE Server SHALL maintain each deck as an ordered list of cards; the top card is always at index 0 and is removed upon drawing.
5. THE Surprise_Card and Community_Chest_Card decks SHALL support the following effect types: advance Player to a specified Cell position, move Player back N spaces as specified on the card, collect a cash amount, pay a cash amount, go directly to Jail (bypassing GO), and Get-Out-of-Jail-Free (held by the player and usable on a subsequent turn to leave Jail without paying the fine).

---

### Requirement 22: Auction Mechanics

**User Story:** As a player, I want unowned properties that are declined to be auctioned, so that all players have a fair chance to acquire them.

#### Acceptance Criteria

1. WHEN the Server initiates an Auction, THE Server SHALL set the Stage to `AUCTION`, broadcast the property being auctioned, set the current highest bid to zero, start a 30-second countdown timer, and notify all Players.
2. WHILE the Stage is `AUCTION`, THE Server SHALL accept a bid from any Player (other than the Player who declined the purchase) whose balance exceeds the current highest bid and whose bid amount is strictly greater than the current highest bid.
3. WHEN a Player explicitly passes during an Auction, THE Server SHALL record that Player as having passed and not accept further bids from them in that Auction.
4. WHEN all non-bankrupt Players have passed or the 30-second timer expires, THE Server SHALL award the auctioned OwnableProperty to the highest bidder, deduct the bid amount from their balance, set the Stage back to `NORMAL`, and broadcast the updated Game_State.
5. IF no Player places a bid before all Players pass or the timer expires, THEN THE Server SHALL leave the property unowned, set the Stage back to `NORMAL`, and broadcast the updated Game_State.
6. IF a Player attempts to bid an amount less than or equal to the current highest bid, THEN THE Server SHALL reject the bid without modifying the Game_State.

---

### Requirement 23: Trading

**User Story:** As a player, I want to propose and negotiate trades with other players, so that I can acquire the properties I need to complete colour blocks.

#### Acceptance Criteria

1. WHEN a Player proposes a Trade, THE Client SHALL allow them to specify: the recipient Player (must be a different Player), the OwnableProperties they are offering (must be owned by the proposer), the cash they are offering (must be ≥ 0), the OwnableProperties they are requesting (must be owned by the recipient), and the cash they are requesting (must be ≥ 0).
2. IF a Player attempts to propose a Trade with themselves as the recipient, THEN THE Client SHALL reject the Trade proposal before submission.
3. WHEN the Trade is submitted, THE Server SHALL add it to the `trades` array in Game_State and broadcast the updated Game_State.
4. WHEN the recipient Player accepts a Trade, THE Server SHALL transfer the specified properties and cash amounts between the two Players, transfer any mortgaged properties with their `isMortgaged` state intact, remove the Trade from the `trades` array, and broadcast the updated Game_State.
5. WHEN either Player cancels a Trade, THE Server SHALL remove the Trade from the `trades` array and broadcast the updated Game_State.
6. IF a Player does not own a property included in their side of the Trade at the time of acceptance, THEN THE Server SHALL reject the Trade acceptance.
7. IF a Player's cash offer exceeds their current balance at the time of acceptance, THEN THE Server SHALL reject the Trade acceptance.
8. WHILE a Trade is pending, THE Server SHALL allow the proposing Player to edit the Trade before the recipient responds.

---

### Requirement 24: Bankruptcy

**User Story:** As a player whose debt exceeds my net worth, I want the bankruptcy process to be handled fairly, so that the game continues correctly after I exit.

#### Acceptance Criteria

1. WHEN a Player's balance falls below zero, THE Server SHALL prompt the Player to raise funds by mortgaging properties or accepting trades before declaring bankruptcy.
2. IF the Player cannot raise sufficient funds to cover the deficit after the prompting phase (no further mortgageable properties and no pending trades cover the debt), THEN THE Server SHALL declare the Player bankrupt.
3. WHEN a Player is declared bankrupt due to a debt owed to another Player, THE Server SHALL transfer all of that Player's OwnableProperties to the creditor Player with their existing `isMortgaged` state intact, and remove the bankrupt Player from the game.
4. WHEN a Player is declared bankrupt due to a debt owed to the bank (tax, card effect, or similar), THE Server SHALL return all of that Player's OwnableProperties to the unowned state (resetting `owner`, `numHouses`, and `isMortgaged` to their defaults) and make them available for purchase, then remove the bankrupt Player from the game.
5. WHEN a Player is removed from the game due to bankruptcy, THE Server SHALL broadcast the updated Game_State and continue the game with the remaining Players.
6. WHEN only one Player remains who is not bankrupt, THE Server SHALL declare that Player the winner, set the Stage to `GAME_OVER`, and broadcast the final Game_State.

---

### Requirement 25: Game State Serialisation

**User Story:** As a developer, I want the Game_State to serialise and deserialise cleanly over JSON/WebSocket, so that all clients remain consistent with the server's canonical state.

#### Acceptance Criteria

1. THE Game_State SHALL be a plain JSON-serialisable object — it MUST NOT contain class instances, functions, or non-serialisable values such as `Map` or `Set`.
2. WHEN the Server broadcasts a Game_State update, THE Client SHALL be able to reconstruct a Game_State object containing all required fields with the correct types from the received JSON without any data loss.
3. WHEN the Server serialises a valid Game_State to JSON and deserialises the result, THE Server SHALL produce an object that is deeply equal to the original for all primitive fields, arrays, and nested objects.
4. THE Server SHALL be the sole authority for producing valid Game_State objects; clients MUST NOT construct or mutate Game_State directly.
