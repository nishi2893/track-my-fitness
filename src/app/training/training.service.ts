import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs'; 
import { Store } from '@ngrx/store';

import { UIService } from '../shared/ui.service';
import { Exercise } from './exercise.model';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {

    isLoading$: Observable<boolean>;
    private firebaseSubscription: Subscription[] = [];
    
    constructor(private db: AngularFirestore,
                private uiService: UIService,
                private store: Store<fromTraining.State>){}

    fetchAvailableExercises(){

    this.store.dispatch(new UI.StartLoading());
    this.firebaseSubscription.push(this.db
    .collection('availableExercises')
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return{
           id: doc.payload.doc.id,
           name: doc.payload.doc.data()['name'],
           duration: doc.payload.doc.data()['duration'],
           calories: doc.payload.doc.data()['calories']
        };
      })
    })).subscribe((exercises: Exercise[]) => {
     this.store.dispatch(new Training.SetAvailableExercises(exercises));
     this.store.dispatch(new UI.StopLoading());
    }, error => {
        this.uiService.showSnackbar('Fetching Exercises failed, please try again!!!', null, 3000);
        this.store.dispatch(new UI.StopLoading());
    }));
    }

    startExercise(selectedId: string){
 
       this.store.dispatch(new Training.StartTraining(selectedId));
    }

    completeExercise(){

        this.store.select(fromTraining.getActiveExercise).pipe(take(1)).subscribe(ex => {

            this.addDataToDatabase({
                ... ex,
                date: new Date(),
                state: 'completed'
            });
            this.store.dispatch(new Training.StopTraining());

        });
        
    }

    cancelExercise(progress: number){

        this.store.select(fromTraining.getActiveExercise).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ... ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date(),
                state: 'cancelled'
            });           
            this.store.dispatch(new Training.StopTraining()); 
        });
    }

    fetchCompletedorCancelledExercises(){
        this.firebaseSubscription.push(this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
            this.store.dispatch(new Training.SetFinishedExercises(exercises));
        }));
    }

    cancelSubscriptions(){
         this.firebaseSubscription.forEach(sub => sub.unsubscribe());
    }
    
    private addDataToDatabase(exercise: Exercise){

        this.db.collection('finishedExercises').add(exercise);

    }
}