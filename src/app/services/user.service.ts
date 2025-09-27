import { Injectable, signal } from '@angular/core'
import { User } from '../models/interface'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser = signal<User | null>(null)
}
