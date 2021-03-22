import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

// test("renders learn react link", () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
// test1: expect the login button div to go away and for a board component to
// be rendered with props.username=username

test('Login space disappears', () => {
  const result = render(<App/>);
  // const loginInput = screen.getByText("Username:").closest('div');
  // const testValue = {username: "Bruh1"};
  // expect(loginButton).toBeInTheDocument();
  // expect(loginButton).toHaveStyle('display: block');
  // fireEvent.click(loginButton);
  // throw new Error(loginButton.value);
  // expect(loginButton).toHaveStyle('display: none');
  const loginButton = screen.getByText("Login");
  const loginText = screen.getByText("Username:");
  expect(loginButton).toBeInTheDocument();
  expect(loginText).toBeInTheDocument();
  fireEvent.click(loginButton);
  expect(loginButton).toHaveStyle({display: "none"});
  expect(loginText).toHaveStyle({display: "none"});
});

test('Leaderboard clicky', () => {
  const {container} = render(<App/>);
  const showLeaderboardButton = screen.getByText('Show Leaderboard');
  const leaderboardElement = screen.getByText('Score');
  expect(leaderboardElement).toHaveStyle('display: none');
  expect(showLeaderboardButton).toBeInTheDocument();
  expect(leaderboardElement).toBeInTheDocument();
  fireEvent.click(showLeaderboardButton);
  expect(leaderboardElement).toHaveStyle('display: block');
  fireEvent.click(showLeaderboardButton);
  expect(leaderboardElement).toHaveStyle('display: none');
});

test('Show board only on login', () => {
  const {container} = render(<App/>);
  const gameInfo = screen.getByText('Player X:');
  const loginButton = screen.getByText("Login");
  const loginText = screen.getByText("Username:");
  expect(gameInfo).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
  expect(loginText).toBeInTheDocument();
  fireEvent.click(loginButton);
  expect(gameInfo).toHaveStyle('display: block');
});
