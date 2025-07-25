import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Resource, Task } from '../../core/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class Shared {

  // mesakki834@gmail.com
  // project_name : Project Management
  // password : vivant360_projectmanagement

  private supabase!: SupabaseClient;

  // constructor() {
  //   this.supabase = createClient(environment.supabase.url, environment.supabase.key);
  // }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(environment.supabase.url, environment.supabase.key);
    }
  }

  async addResources(resource: Resource) {
    const { data: result, error } = await this.supabase
      .from('resources')
      .insert([resource])
      .select();
    if (error) {
      console.error('Supabase insert error:', error);
    }
    return { data: result, error };
  }

  async getResources() {
    if (!this.supabase) return { data: null, error: 'Supabase not initialized' };

    const { data: users, error } = await this.supabase.from('resources').select('*');
    if (error) console.error('Supabase fetch error:', error);
    return { data: users, error };
  }

  async deleteResource(id: string) {
    const { error } = await this.supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
    }

    return { error };
    // return { error: new Error('esakki') };
  }

  async editResource(updatedData: Resource) {
    const userId = updatedData.id ?? '';
    const { data, error } = await this.supabase
      .from('resources')
      .update(updatedData)
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return { error };
    }

    return { data, error };
  }

  async addTasks(task: Task) {
    const { data: result, error } = await this.supabase
      .from('tasks')
      .insert([task])
      .select();
    if (error) {
      console.error('Supabase insert error:', error);
    }
    return { data: result, error };
  }

  async getTasks() {
    if (!this.supabase) return { data: null, error: 'Supabase not initialized' };

    const { data: users, error } = await this.supabase.from('tasks').select('*');
    if (error) console.error('Supabase fetch error:', error);
    return { data: users, error };
  }

  async deleteTask(id: string) {
    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
    }

    return { error };
    // return { error: new Error('esakki') };
  }

  async editTask(updatedData: Partial<Task>) {
    const userId = updatedData.id ?? '';
    const { data, error } = await this.supabase
      .from('tasks')
      .update(updatedData)
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return { error };
    }

    return { data, error };
  }


}
