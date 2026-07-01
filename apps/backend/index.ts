import  Express from "express";
import cors from "cors";
import { middleware } from "./middleware";
const app = Express();

app.use(Express.json());
app.use(cors());

app.post("/buy", middleware, (req, res)=>{
   res.json({
    message : "hiiiiii"
   })  
});

app.post("/sell",middleware, (req, res)=>{
    
});

app.post("/split",middleware, (req, res)=>{
    
});

app.post("/merge",middleware, (req, res)=>{
    
});

app.get("/balance",middleware, (req, res)=>{
    
})
app.get("/position", middleware, (req, res)=>{
    
})
app.get("/history", middleware, (req, res)=>{
    
})


app.listen(3000,()=> console.log("app is listening"));