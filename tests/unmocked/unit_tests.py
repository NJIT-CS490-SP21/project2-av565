# pylint: disable=all
import unittest
import sys
import os

sys.path.append(os.path.abspath('../../'))
from app import set_and_select_players, configure_db, LOGGED_IN_USERS, GAMERS


def absoluteLength(vals):
    if type(vals) == dict:
        return len(vals.keys()) + len(vals.values())
    if type(vals[0]) != list:
        return len(vals) * 2
    return sum([len(arr) for arr in arr_of_arrs])


key_input = "input"
key_expected = "expected"
key_length = "length"


class Person:
    username = ""
    score = 100

    def __init__(self, name, score):
        self.username = name
        self.score = score


class PlayerSelectionTest(unittest.TestCase):
    def setUp(self):
        self.success_test_params1 = [{
            key_input: ["Me", "You", "The Beach", "Us", "Holding Hands"],
            key_expected: [["Me", "You", "The Beach", "Us", "Holding Hands"],
                           ["Me", "You", "The Beach", "Us", "Holding Hands"],
                           ["Me", "You"]],
            key_length:
            12
        }, {
            key_input: ["ESLint", "Sucks", "A55", "Foo"],
            key_expected: [["ESLint", "Sucks", "A55", "Foo"],
                           ["ESLint", "Sucks", "A55", "Foo"],
                           ["ESLint", "Sucks"]],
            key_length:
            10
        }]

        self.success_test_params2 = [{
            key_input: [
                Person("Step-bro", 6),
                Person("ESLint", 120),
                Person("ESLint Sucks", 90)
            ],
            key_expected: {
                "ESLint": 120,
                "ESLint Sucks": 90,
                "Step-bro": 6
            },
            key_length:
            6
        }, {
            key_input: [
                Person("Step-sis", 9),
                Person("EVERYONE HATES ESLINT", -sys.maxsize - 1),
                Person("Freespeech", 999),
                Person("AMD Is Best", 1000),
                Person("GME To The Moon", 0),
                Person("Naman's Class and TAs", sys.maxsize)
            ],
            key_expected: {
                "Naman's Class and TAs": sys.maxsize,
                "AMD Is Best": 1000,
                "Freespeech": 999,
                "Step-sis": 9,
                "GME To The Moon": 0,
                "EVERYONE HATES ESLINT": -sys.maxsize - 1
            },
            key_length:
            12
        }]

    def testSelectionSuccess1(self):
        for test in self.success_test_params1:
            to_test = set_and_select_players(test[key_input])
            expected = test[key_expected]

            self.assertEqual(absoluteLength(to_test), test[key_length])
            for i in range(3):
                self.assertEqual(len(to_test[i]), len(expected[i]))
                self.assertEqual(to_test[i], expected[i])

    def testSelectionSuccess2(self):
        for test in self.success_test_params2:
            to_test = configure_db(test[key_input])
            expected = test[key_expected]
            k = list(to_test.keys())
            ks = list(expected.keys())

            self.assertEqual(absoluteLength(to_test), test[key_length])
            self.assertEqual(1, len(k) / len(ks))
            for i in range(len(k)):
                self.assertEqual(len(k[i]), len(ks[i]))
                self.assertEqual(k[i], ks[i])
                self.assertEqual(to_test[k[i]], expected[ks[i]])
            self.assertEqual([
                p.score for p in sorted(
                    test[key_input], key=lambda x: x.score, reverse=True)
            ], list(expected.values()))


if __name__ == "__main__":
    unittest.main()
