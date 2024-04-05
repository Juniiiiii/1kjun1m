const gridRows = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-rows'));
const gridCols = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-cols'));

const insideTheMindOfCoordinates=[[1,22],[1,36],[2,22],[2,36],[3,2],[3,16],[3,22],[3,33],[3,36],[4,22],[4,33],[4,36],[5,2],[5,4],[5,6],[5,7],[5,11],[5,12],[5,13],[5,16],[5,19],[5,20],[5,21],[5,22],[5,25],[5,26],[5,27],[5,33],[5,34],[5,36],[5,38],[5,39],[5,43],[5,44],[5,45],[6,2],[6,4],[6,5],[6,8],[6,10],[6,14],[6,16],[6,18],[6,22],[6,24],[6,28],[6,33],[6,36],[6,37],[6,40],[6,42],[6,46],[7,2],[7,4],[7,8],[7,11],[7,12],[7,16],[7,18],[7,22],[7,24],[7,25],[7,26],[7,27],[7,28],[7,33],[7,36],[7,40],[7,42],[7,43],[7,44],[7,45],[7,46],[8,2],[8,4],[8,8],[8,13],[8,16],[8,18],[8,22],[8,24],[8,33],[8,36],[8,40],[8,42],[9,2],[9,4],[9,8],[9,10],[9,14],[9,16],[9,18],[9,22],[9,24],[9,28],[9,33],[9,36],[9,40],[9,42],[9,46],[10,2],[10,4],[10,8],[10,11],[10,12],[10,13],[10,16],[10,19],[10,20],[10,21],[10,22],[10,25],[10,26],[10,27],[10,34],[10,36],[10,40],[10,43],[10,44],[10,45],[13,22],[13,34],[14,22],[14,33],[15,10],[15,22],[15,33],[16,22],[16,33],[17,2],[17,3],[17,4],[17,6],[17,7],[17,10],[17,12],[17,14],[17,15],[17,19],[17,20],[17,21],[17,22],[17,28],[17,29],[17,30],[17,33],[17,34],[18,2],[18,5],[18,8],[18,10],[18,12],[18,13],[18,16],[18,18],[18,22],[18,27],[18,31],[18,33],[19,2],[19,5],[19,8],[19,10],[19,12],[19,16],[19,18],[19,22],[19,27],[19,31],[19,33],[20,2],[20,5],[20,8],[20,10],[20,12],[20,16],[20,18],[20,22],[20,27],[20,31],[20,33],[21,2],[21,5],[21,8],[21,10],[21,12],[21,16],[21,18],[21,22],[21,27],[21,31],[21,33],[22,2],[22,5],[22,8],[22,10],[22,12],[22,16],[22,19],[22,20],[22,21],[22,22],[22,28],[22,29],[22,30],[22,33]];
const ourVoiceCoordinates=[[7,4],[7,5],[7,6],[7,7],[7,20],[7,26],[8,3],[8,8],[8,20],[8,26],[9,3],[9,8],[9,21],[9,25],[9,33],[10,3],[10,8],[10,21],[10,25],[11,3],[11,8],[11,10],[11,14],[11,16],[11,18],[11,19],[11,21],[11,25],[11,28],[11,29],[11,30],[11,33],[11,36],[11,37],[11,38],[11,42],[11,43],[11,44],[12,3],[12,8],[12,10],[12,14],[12,16],[12,17],[12,22],[12,24],[12,27],[12,31],[12,33],[12,35],[12,39],[12,41],[12,45],[13,3],[13,8],[13,10],[13,14],[13,16],[13,22],[13,24],[13,27],[13,31],[13,33],[13,35],[13,41],[13,42],[13,43],[13,44],[13,45],[14,3],[14,8],[14,10],[14,14],[14,16],[14,22],[14,24],[14,27],[14,31],[14,33],[14,35],[14,41],[15,3],[15,8],[15,10],[15,13],[15,14],[15,16],[15,23],[15,27],[15,31],[15,33],[15,35],[15,39],[15,41],[15,45],[16,4],[16,5],[16,6],[16,7],[16,11],[16,12],[16,14],[16,16],[16,23],[16,28],[16,29],[16,30],[16,33],[16,36],[16,37],[16,38],[16,42],[16,43],[16,44]];

const minimumPixelCount = Math.max(ourVoiceCoordinates.length, insideTheMindOfCoordinates.length);

const insideTheMindOfText = [
    `
    Mission Statement: Create a personal and unique portfolio that not only shows my projects, but allows the user to see inside his mind, as if they were seeing who Ikjun Im is as a person, from his values, personality, weaknesses and his technical prowess.
    <br/><br/>
    Background: Going into this project he had little to no experience with HTML,CSS or JS. The most exposure he got with these languages was through simple projects he undertook in USYD. But this website was an ambitious project, not comparable in size to the projects he did in university, as it was entirely under his control, from design to implementation. So going into this project, he knew it would be a challenging, yet fun task.
    <br/><br/>
    Technologies used: HTML, CSS, JavaScript, matterJS, animeJS, Github.
    <br/><br/>
    Outcome: The website that you see now is his creation and because this client of this project is you, you get to decide whether his mission statement was delivered or not. But other than the website, he has gained valuable insight into all the technologies above, learning the process of planning, designing, executing and implementing all ideas into a single product. All in all, this proved to be a very valuable experience for him to get ready before taking his first step into the professional world.
    `,
    `
    I honestly didn’t know that the rabbit hole of web development would go down so far. At first I was overwhelmed with so many different technologies but ultimately, I decided to go with vanilla HTML, CSS and JS instead of frameworks because what I wanted to get out of this project was to really deepen my understanding on the very backbone of web development. An analogy for my thinking process would be “learning tailwind isn’t learning CSS”.
    <br/><br/>
    My first step with the website was creating a design that aligns with my mission statement. Because it should reflect my personality, I knew that it should have a blend of seriousness and playfulness and I knew that this would be a challenge to unify these opposing ideas into a single product. I tackled this problem by using black and white with a serif font to reflect my seriousness with colorful accents weaving in and out of the website to add hints of my playfulness with an interactive playground to show off my creativity. (Fun fact: the letters on the first page were made by me)
    <br/><br/>
    Once I got my big picture idea ready, implementation was next in line. Even though the planning was already done beforehand, it was still difficult to actually write the code because I had to learn all the technologies from scratch, by myself. I mainly relied on documentation of the respective technologies, big thanks to Mozilla for HTML, CSS and JS, but overall I enjoy the process of learning and finding unique ways to creatively express myself, so I found it to be a fun journey.
    <br/><br/>
    The project overall took about 300 hours, spanning over the course of about 50 days.    
    `
];

const ourVoiceText = [
    `
    Mission Statement: Improve overall UI/UX for users and create new logic on an
    existing codebase and graphical interfaces for administrative tasks for a social media website with the goal of improving communication between the people and the democratic government of Australia.
    <br/><br/>
    Background: This was a capstone project undertaken at the University of Sydney with seven people in the group in total. The client presented the team with a list of functionalities he wished to implement, and the team collectively discussed and picked features which were deemed to be the most significant. The project had many deliverables, including presentations, written reports as well as weekly meetings with the client to ensure quality of work. This work was done over the course of the semester (roughly 12 weeks) using an agile and scrum approach.
    <br/><br/>
    Technologies used: HTML, CSS, TypeScript, React, nextJS, Figma, Serverless, AWS DynamoDB, Jest, and other AWS services (Cognito, Lambda etc.).
    <br/><br/>
    Outcome: The team successfully presented all its deliverables selected at the beginning of the project to the client during a final pitch. Apart from meeting the client’s standards for improving the UI/UX of the website at the end, this was a valuable experience for Ikjun. Working side by side with team members of different levels, sharing ideas and conversing with the client has massively improved his communication. More importantly, he has gained insight into how to work as a team on a single codebase with many complex technologies working in the background.
    `,
    `
    First time working in a professional environment with a team and a client, first time working with React and AWS. Without saying much I can pretty much tell you that for the first few days, it was just reading through the codebase to understand the code and the nature of web development and it didn’t help that the client wasn’t technically proficient and the group had no one to explain the codebase. 
    <br/><br/>
    I knew I was thrown in the deep end of the pool, but I embraced it and because I am a fast learner, I was able to get on my feet quickly and begin working on my deliverables. When the group picked the tasks and were assigning them to individuals, I picked two user stories, one for the front (dark mode) and back-end (administrators granting moderator permissions) to gain exposure to both.
    <br/><br/>
    On top of developing the code, I also had to conform to scrum principles, ensuring that my code was up to standard by rigorously testing my code using Jest and having a pair programmer to evaluate my work. During weekly meetings with the client, I often demoed my work to the client to show the work I completed during that week and gain the client’s approval.
    <br/><br/>
    Using many complex technologies and being thrown in the deep end wasn’t a pleasant experience, in fact it was often frustrating. But the outcome of this was extremely rewarding as I not only gained technical insight into React, AWS and web development as a whole but also gained professional experience in working with a team and a client. 
    `
];