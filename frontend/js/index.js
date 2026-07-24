async function loadLeaderboard() {

    try {

        const response = await fetch("http://localhost:8080/api/result/leaderboard");

        const data = await response.json();

        let html = "";

        data.forEach((student, index) => {

            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${student.username}</td>
                    <td>${student.quizName}</td>
                    <td>${student.score}/${student.totalQuestions}</td>
                </tr>
            `;

        });

        document.getElementById("leaderboardBody").innerHTML = html;

    } catch (error) {

        console.log(error);

        document.getElementById("leaderboardBody").innerHTML = `
            <tr>
                <td colspan="4">
                    Unable to load leaderboard
                </td>
            </tr>
        `;

    }

}

loadLeaderboard();