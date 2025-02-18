import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators'
import { PostService } from '../../services/post.service';
import { FormsModule } from '@angular/forms'; 
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  standalone: true,
  selector: 'app-posts',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, CommonModule, AngularFireStorageModule, FormsModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'] 
})
export class PostsComponent {


  constructor(
     public userService: UserService,
     private router:Router,
     private storage:AngularFireStorage,
     public postService: PostService,
      private snackbar:MatSnackBar
  ) { }
  
  ngOnInit(): void {
    if(this.userService.user == undefined || this.userService.user == null){
      let str = localStorage.getItem('user');
      if(str != null){
        this.userService.user = JSON.parse(str);
      }
      else{
        this.router.navigate(['/login']);
      }
    }
    this.postService.getPosts().then((res:any)=>{
      this.posts = res;
      for(let post of this.posts){
        this.commentText.push("");
      }
    }).catch((err)=>{
      console.log(err);
    })
  }

  selectedFile:any;
  text = "";
  posts:Array<any> = [];
  commentText:Array<string> = [];

  onFileSelected(event:any){
    this.selectedFile = event.target.files[0];
  }

  clearFileInput() {
    this.selectedFile = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  post(){
    this.snackbar.open('Creating the post...', '', {duration:15000});
    if(this.selectedFile != undefined || this.selectedFile != null){
      this.uploadImage().then((imageURL)=>{
        console.log(imageURL);
        let postObj = {
          username: this.userService.user.username,
          text : this.text,
          imageURL: imageURL,
          likes: [],
          comments:[]
        };
        this.posts.push(postObj);
        this.postService.saveNewPost(postObj).then((res)=>{
          console.log(res);
          this.snackbar.open('Posted successfully', 'ok');
        }).catch((err)=>{
          console.log(err);
        });
        this.selectedFile = undefined;
        
      }).catch((err)=>{
        console.log(err);
      })
    }
    else{
      let postObj = {
        username: this.userService.user.username,
        text : this.text,
        imageURL: '',
        likes: [],
        comments:[]
      };
      this.posts.push(postObj);
      this.postService.saveNewPost(postObj).then((res)=>{
        console.log(res);
        this.snackbar.open('Posted successfully', 'ok');
      }).catch((err)=>{
        console.log(err);
      });
    }
  }

  uploadImage() {
    return new Promise((resolve, reject) => {
      let n = Date.now();
      const file = this.selectedFile;
      const filePath = `images/${n}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`images/${n}`, file);
      task.snapshotChanges().pipe(
        finalize(() => {
          let imageURL = fileRef.getDownloadURL();
          imageURL.subscribe((url: any) => {
            if (url) {
              console.log(url);
              resolve(url);
            }
          });
        })
      ).subscribe(
        (url)=>{
          if(url){
            console.log(url);
          }
        }
      );
    });
  }

  like(postId:any){
    for(let i = 0; i < this.posts.length; i++){
      if(this.posts[i].id == postId){
        if(this.posts[i].likes.indexOf(this.userService.user.id) >= 0){
          this.posts[i].likes.splice(this.posts[i].likes.indexOf(this.userService.user.id), 1);
        }
        else{
          this.posts[i].likes.push(this.userService.user.id);
        }
        this.postService.updateLikes(this.posts[i]).then((res)=>{
          console.log(res);
        }).catch((err)=>{
          console.log(err);
        })
      }
    }
  }

  comment(postId:any, commentIndex:any){
    for(let i = 0; i < this.posts.length; i++){
      if(this.posts[i].id == postId){
        let commentObj = {
          username: this.userService.user.username,
          comment: this.commentText[commentIndex]
        };
        this.posts[i].comments.push(commentObj);
        this.commentText[commentIndex] = "";
        this.postService.updateComments(this.posts[i]);
      }
    }
  }

  postSchema = {
    username :'',
    imageURL:'',
    text:'',
    likes:[],
    comments:[{username:'', comment:''}]
  }

}
