// funciones de almacenamiento

function getStudent(){
    return JSON.parse(localStorage.getItem("Students")) || [];
}

function clearStorage(){
    localStorage.removeItem("Students");
    console.log("LocalStorage limpiado");
}

function saveStudent(student){
    const students = getStudent();
    students.push(student);
    localStorage.setItem("Students", JSON.stringify(students));
}

function deleteStudent(index){
    const students = getStudent();
    students.splice(index, 1); // elimina 1 estudiante en la posición index
    localStorage.setItem("Students", JSON.stringify(students));
    renderList(); // vuelve a renderizar la lista actualizada
}


// Routing

function router (){
    const path = location.hash.slice(1) || "/";
    const app = document.getElementById("app");
    app.innerHTML = "";

    let templateId;

    if (path === "/") {
        templateId = "formTemplate";
    } else if (path === "/lista") {
        templateId = "list-template";
    } else {
        templateId = "404-template";
    }

    const template = document.getElementById(templateId);
    console.log('Template encontrado:', templateId, template);
    
    if (template) {
        app.appendChild(template.content.cloneNode(true));
    } else {
        app.innerHTML = `<h2>Template "${templateId}" no encontrado</h2>`;
    }

    if (path === "/") {
        attachFormLogic();
    } else if (path === "/lista"){
        console.log('Navegando a lista, ejecutando renderList...');
        setTimeout(() => {
            renderList();
        }, 100);
    }
}

function attachFormLogic(){
    const form = document.getElementById("studentForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const n1 = parseFloat(document.getElementById("nota1").value);
        const n2 = parseFloat(document.getElementById("nota2").value);
        const n3 = parseFloat(document.getElementById("nota3").value);
        
        if (!name || isNaN(n1) || isNaN(n2) || isNaN(n3)) {
            document.getElementById("msg").textContent = "Por favor, complete todos los campos correctamente. 🍪";
            return;
        }

        const avg = (n1 + n2 + n3) / 3;
        const student = { name, avg };
        
        console.log('Guardando estudiante:', student);
        saveStudent(student);
        
        const students = getStudent();
        console.log('Estudiantes en localStorage:', students);

        document.getElementById("msg").textContent = `Estudiante ${name} guardado con éxito con promedio ${avg.toFixed(2)}! 🎉`;

        form.reset();
    })
}

function renderList(){
    const students = getStudent();
    console.log('Renderizando lista con estudiantes:', students);
    
    const list = document.getElementById("studentList");
    if (!list) {
        console.error('Elemento studentList no encontrado');
        return;
    }
    
    list.innerHTML = "";
    
    if (students.length === 0) {
        const empty = document.createElement("li");
        empty.textContent = "No hay estudiantes registrados. 🍍";
        list.appendChild(empty);
        return;
    }

    const template = document.getElementById("student-item-template");
    if (!template) {
        console.error('Template student-item-template no encontrado');
        return;
    }

students.forEach((s, i) => {
    console.log('Renderizando estudiante:', s);
    const clone = template.content.cloneNode(true);
    clone.querySelector(".student-name").textContent = s.name;
    clone.querySelector(".student-avg").textContent = parseFloat(s.avg).toFixed(2);

    // botón de borrar
    const deleteBtn = clone.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
        console.log(`Eliminando estudiante en índice ${i}:`, s);
        deleteStudent(i);
    });

    list.appendChild(clone);
});

    
    console.log('Lista renderizada completamente');
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);