import { createServerSupabaseClient } from "./client";
import AddTaskForm from "./AddTaskForm";

export default async function Home() {
  // Use the custom Supabase client you created
  const client = createServerSupabaseClient();

  // Query the 'tasks' table to render the list of tasks
  

  return (
    <div>
      <h1>Tasks</h1>

      <div>
   
      </div>

      
    </div>
  );
}
