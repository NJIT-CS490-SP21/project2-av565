import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
from app import add_to_db, change_points
import models

key_input = "input"
key_expected = "expected"

initial_username = "bruh1"


class UserTest(unittest.TestCase):
    def setUp(self):
        self.success_test_params1 = [{
            key_input:
            "bruh2",
            key_expected: [
                models.Leaderboard(username=initial_username, score=100),
                models.Leaderboard(username="bruh2", score=100)
            ]
        }, {
            key_input:
            "bruh3",
            key_expected: [
                models.Leaderboard(username=initial_username, score=100),
                models.Leaderboard(username="bruh2", score=100),
                models.Leaderboard(username="bruh3", score=100)
            ]
        }, {
            key_input:
            "bruh4",
            key_expected: [
                models.Leaderboard(username=initial_username, score=100),
                models.Leaderboard(username="bruh2", score=100),
                models.Leaderboard(username="bruh3", score=100),
                models.Leaderboard(username="bruh4", score=100)
            ]
        }]

        self.success_test_params2 = [{
            key_input: [
                models.Leaderboard(username="IWon", score=100),
                models.Leaderboard(username="ILost", score=100)
            ],
            key_expected: [
                models.Leaderboard(username="IWon", score=101),
                models.Leaderboard(username="ILost", score=99)
            ]
        }, {
            key_input: [
                models.Leaderboard(username="StepSis", score=68),
                models.Leaderboard(username="StepBro", score=97)
            ],
            key_expected: [
                models.Leaderboard(username="StepSis", score=69),
                models.Leaderboard(username="StepBro", score=96)
            ]
        }, {
            key_input: [
                models.Leaderboard(username="Suck, does", score=2020),
                models.Leaderboard(username="ESLint", score=556)
            ],
            key_expected: [
                models.Leaderboard(username="Suck, does", score=2021),
                models.Leaderboard(username="ESLint", score=555)
            ]
        }]

        initial_user = models.Leaderboard(username=initial_username, score=100)
        self.initial_db_mock = [initial_user]

    def mockedDBAdd(self, name):
        self.initial_db_mock.append(name)

    def mockedDBCommit(self):
        pass

    def mockedLeaderboardQueryAll(self):
        return self.initial_db_mock

    def testAddSuccess1(self):
        for test in self.success_test_params1:
            with patch("app.DB.session.add", self.mockedDBAdd):
                with patch("app.DB.session.commit", self.mockedDBCommit):
                    with patch("models.Leaderboard.query") as mocked_query:
                        print("Here: ", mocked_query.all)
                        mocked_query.all = self.mockedLeaderboardQueryAll

                        # print("Before testing:", self.initial_db_mock)
                        to_test = add_to_db(test[key_input])
                        # print("Tested:", to_test)
                        expected = test[key_expected]
                        # print("Expected:", expected)
                        # print("After testing:", self.initial_db_mock)

                        self.assertEqual(len(to_test), len(expected))
                        for i in range(len(to_test)):
                            self.assertEqual(len(str(to_test[i])),
                                             len(str(expected[i])))
                            self.assertEqual(to_test[i].username,
                                             expected[i].username)
                            self.assertEqual(to_test[i].score,
                                             expected[i].score)

    # def mockedDBSessionQuery(self, model):

    def testAddSuccess2(self):
        # test = self.success_test_params2[0]
        for test in self.success_test_params2:
            with patch("app.DB.session.commit", self.mockedDBCommit):
                to_test = change_points(*test[key_input])
                expected = test[key_expected]
                self.assertEqual(len(to_test), len(expected))
                for i in range(len(to_test)):
                    self.assertEqual(len(str(to_test[i])),
                                     len(str(expected[i])))
                    self.assertEqual(to_test[i].username, expected[i].username)
                    self.assertEqual(to_test[i].score, expected[i].score)
        # for test in self.success_test_params2:


if __name__ == "__main__":
    unittest.main()
