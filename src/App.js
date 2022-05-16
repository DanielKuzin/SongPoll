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
  };

  componentDidMount() {
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
    }, 5000);
  };

  handleVote = (voteAnswer) => {
    axios.get("https://627b91cfb54fe6ee008a6235.mockapi.io/data/1").then(
      (response) => {
        let pollAnswers = this.state.pollAnswers;
        switch (voteAnswer) {
          case response.data.song1Name + " - " + response.data.song1Artist:
            axios.put("https://627b91cfb54fe6ee008a6235.mockapi.io/data/1", {
              song1Votes: response.data.song1Votes + 1,
            });
            pollAnswers[0].votes = response.data.song1Votes + 1;
            this.setState({
              pollAnswers: pollAnswers,
            });
            break;
          case response.data.song2Name + " - " + response.data.song2Artist:
            axios.put("https://627b91cfb54fe6ee008a6235.mockapi.io/data/1", {
              song2Votes: response.data.song2Votes + 1,
            });
            pollAnswers[1].votes = response.data.song2Votes + 1;
            this.setState({
              pollAnswers: pollAnswers,
            });
            break;
          case response.data.song3Name + " - " + response.data.song3Artist:
            axios.put("https://627b91cfb54fe6ee008a6235.mockapi.io/data/1", {
              song3Votes: response.data.song3Votes + 1,
            });
            pollAnswers[2].votes = response.data.song3Votes + 1;
            this.setState({
              pollAnswers: pollAnswers,
            });
            break;
          case response.data.song4Name + " - " + response.data.song4Artist:
            axios.put("https://627b91cfb54fe6ee008a6235.mockapi.io/data/1", {
              song4Votes: response.data.song4Votes + 1,
            });
            pollAnswers[3].votes = response.data.song4Votes + 1;
            this.setState({
              pollAnswers: pollAnswers,
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
          backgroundImage: `url("https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
        }}
      >
        <h1 className="name">Now playing:</h1>
        <h2>
          {this.state.playingSong.name + " - " + this.state.playingSong.artist}
        </h2>
        {/* <img
          style={{
            resizeMode: "cover",
            height: 100,
            width: 100,
          }}
          src={this.state.playingSong.image}
        ></img> */}
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
