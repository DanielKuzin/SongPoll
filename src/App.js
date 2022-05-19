import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Poll from "react-polls";

const pollStyles = {
  questionSeparator: true,
  questionSeparatorWidth: "question",
  questionBold: true,
  questionColor: "#303030",
  align: "center",
  theme: "purple",
};

export default class App extends Component {
  state = {
    isLoading: true,
    pollAnswers: [],
    playingSong: {
      name: "",
      artist: "",
    },
    lyrics: "",
    ipAddress: "",
    voted: false,
  };

  getIpAddress() {
    axios.get("https://geolocation-db.com/json/").then((res) => {
      this.setState({
        ipAddress: res.data.IPv4,
      });
    });
  }

  componentDidMount() {
    // this.getIpAddress();
    this.getData();
    this.autoRefreshVotes();
  }

  autoRefreshVotes = () => {
    setTimeout(() => {
      this.setState({ isLoading: true });
      this.getData();
      if (this.state.lyrics === "" && this.state.playingSong.name !== "") {
        this.getLyrics(
          this.state.playingSong.name,
          this.state.playingSong.artist
        );
      }
      this.autoRefreshVotes();
    }, 4000);
  };

  sendVote = (voteAnswer) => {
    axios.get("https://627b91cfb54fe6ee008a6235.mockapi.io/data/1").then(
      (response) => {
        let pollAnswers = this.state.pollAnswers;
        switch (voteAnswer) {
          case response.data.song1Name + " - " + response.data.song1Artist:
            axios
              .put("https://627b91cfb54fe6ee008a6235.mockapi.io/data/1", {
                song1Votes: response.data.song1Votes + 1,
              })
              .then(() => {
                pollAnswers[0].votes = response.data.song1Votes + 1;
                this.setState({
                  pollAnswers: pollAnswers,
                });
              });
            break;
          case response.data.song2Name + " - " + response.data.song2Artist:
            axios
              .put("https://627b91cfb54fe6ee008a6235.mockapi.io/data/1", {
                song2Votes: response.data.song2Votes + 1,
              })
              .then(() => {
                pollAnswers[1].votes = response.data.song2Votes + 1;
                this.setState({
                  pollAnswers: pollAnswers,
                });
              });
            break;
          case response.data.song3Name + " - " + response.data.song3Artist:
            axios
              .put("https://627b91cfb54fe6ee008a6235.mockapi.io/data/1", {
                song3Votes: response.data.song3Votes + 1,
              })
              .then(() => {
                pollAnswers[2].votes = response.data.song3Votes + 1;
                this.setState({
                  pollAnswers: pollAnswers,
                });
              });
            break;
          case response.data.song4Name + " - " + response.data.song4Artist:
            axios
              .put("https://627b91cfb54fe6ee008a6235.mockapi.io/data/1", {
                song4Votes: response.data.song4Votes + 1,
              })
              .then(() => {
                pollAnswers[3].votes = response.data.song4Votes + 1;
                this.setState({
                  pollAnswers: pollAnswers,
                });
              });
            break;
          default:
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  markUserVote(voteAnswer) {
    localStorage.setItem("playingSongName", this.state.playingSong.name);
    localStorage.setItem("voteAnswer", voteAnswer);
  }

  userVoted() {
    let previousVote = localStorage.getItem("voteAnswer");
    return (
      localStorage.getItem("playingSongName") === this.state.playingSong.name &&
      (previousVote === this.state.pollAnswers[0].option ||
        previousVote === this.state.pollAnswers[1].option ||
        previousVote === this.state.pollAnswers[2].option ||
        previousVote === this.state.pollAnswers[3].option)
    );
  }

  handleVote = (voteAnswer) => {
    if (this.userVoted()) {
      this.setState({
        voted: true,
      });
      return;
    }
    this.markUserVote(voteAnswer);
    this.sendVote(voteAnswer);
  };

  getLyrics = (trackName, trackArtist) => {
    if (this.state.isLoading === true) return;
    axios
      .get("https://dans-player-server.lm.r.appspot.com/lyrics", {
        params: {
          track: trackName,
          artist: trackArtist,
        },
      })
      .then((res) => {
        this.setState({
          lyrics: res.data.lyrics,
        });
      });
  };

  getData() {
    if (this.state.isLoading === false) return;
    this.setState({
      isLoading: false,
    });
    // Get votes
    axios.get("https://627b91cfb54fe6ee008a6235.mockapi.io/data/1").then(
      (response) => {
        if (response.data.playingSongName !== this.state.playingSong.name) {
          let oldSongName = this.state.playingSong.name;
          if (oldSongName !== "") window.location.reload(false);
          this.getLyrics(
            response.data.playingSongName,
            response.data.playingSongArtist
          );
          this.setState({
            playingSong: {
              name: response.data.playingSongName,
              artist: response.data.playingSongArtist,
            },
          });
        }
        this.setState({
          pollAnswers: [
            {
              option:
                response.data.song1Name + " - " + response.data.song1Artist,
              votes: response.data.song1Votes,
            },
            {
              option:
                response.data.song2Name + " - " + response.data.song2Artist,
              votes: response.data.song2Votes,
            },
            {
              option:
                response.data.song3Name + " - " + response.data.song3Artist,
              votes: response.data.song3Votes,
            },
            {
              option:
                response.data.song4Name + " - " + response.data.song4Artist,
              votes: response.data.song4Votes,
            },
          ],
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  render() {
    return (
      <div
        className="app"
        style={{
          backgroundImage: `url("https://i.pinimg.com/564x/13/62/25/1362258d5fa4a20660ab5ede0ce9c0ed.jpg")`,
        }}
      >
        <h1>Now playing:</h1>
        <h2>
          {this.state.playingSong.name + " - " + this.state.playingSong.artist}
        </h2>
        {this.state.voted && (
          <h2 style={{ color: "red" }}>You already voted! can't vote twice</h2>
        )}
        <main className="main">
          <div>
            <Poll
              question={"What would you like to hear next?"}
              answers={this.state.pollAnswers}
              onVote={(voteAnswer) =>
                this.handleVote(voteAnswer, this.state.pollAnswers)
              }
              customStyles={pollStyles}
              noStorage
            />
          </div>
        </main>
        {this.state.lyrics !== "" && this.state.lyrics !== "No Lyrics Found" && (
          <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
            <h3>Lyrics</h3>
            <div
              className="text-center"
              style={{
                whiteSpace: "pre-wrap",
              }}
            >
              {this.state.lyrics}
            </div>
          </div>
        )}
      </div>
    );
  }
}
