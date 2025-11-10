let authorLinks = document.querySelectorAll(".authors");
        for (let i of authorLinks) {
            i.addEventListener("click", getAuthorInfo);
        }
        //event Listener
        
        function $(selector) {
            return document.querySelector(selector);
        }

        $("#closeModal").addEventListener("click", () => { $("#authorModal").close(); });

        async function getAuthorInfo(){
            let authorId = this.getAttribute("authorId");
            let url = "api/authors/" + authorId;    
            let response = await fetch(url);
            let data = await response.json();
            console.log(data);
            $("#authorName").textContent = data[0].firstName + " " + data[0].lastName;
            $("#authorImage").src = data[0].portrait;
            $("#dob").textContent = data[0].dob;
            $("#dod").textContent = data[0].dod;
            $("#authorSex").textContent = data[0].sex;
            $("#authorBio").textContent = data[0].biography;
            $("#authorBirthplace").textContent = data[0].country;
            $("#authorModal").showModal();
        }