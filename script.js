
document.addEventListener("DOMContentLoaded", () => {
    const homeSection = document.getElementById("homeSection");
    const newPostSection = document.getElementById("newPostSection");
    const postDetailsSection = document.getElementById("postDetailsSection");

    const homeBtn = document.getElementById("homeBtn");
    const newPostBtn = document.getElementById("newPostBtn");
    const backBtn = document.getElementById("backBtn");

    const postsContainer = document.getElementById("postsContainer");
    const postForm = document.getElementById("postForm");
    const postTitle = document.getElementById("postTitle");
    const postContent = document.getElementById("postContent");

    let posts = [];

    // Navigation functions
    homeBtn.addEventListener("click", () => {
        showSection(homeSection);
    });

    newPostBtn.addEventListener("click", () => {
        showSection(newPostSection);
    });

    backBtn.addEventListener("click", () => {
        showSection(homeSection);
    });

    // Show specific section
    function showSection(header) {
        homeSection.style.display = "none";
        newPostSection.style.display = "none";
        postDetailsSection.style.display = "none";

        header.style.display = "block";
    }

    // Handle new post submission
    postForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;

        const newPost = { title, content };
        posts.push(newPost);
        renderPosts();

        postForm.reset();
        showSection(homeSection);
    });

    // Render posts
    function renderPosts() {
        postsContainer.innerHTML = "";
        posts.forEach((post, index) => {
            const postDiv = document.createElement("div");
            postDiv.classList.add("post");
            postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content.slice(0, 100)}...</p>
                <button onclick="viewPost(${index})">Read More</button>
            `;
            postsContainer.appendChild(postDiv);
        });
    }

    // View post details
    window.viewPost = (index) => {
        const post = posts[index];
        postTitle.textContent = post.title;
        postContent.textContent = post.content;
        showSection(postDetailsSection);
    };
});
