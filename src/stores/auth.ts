import { defineStore } from "pinia";
import { ref } from "vue";
import { createClient, User } from "@supabase/supabase-js";
import { supabase } from "../supabase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Inicializar al cargar la aplicación
  const initAuth = async () => {
    loading.value = true;

    try {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      user.value = data.session?.user || null;
    } catch (err) {
      console.error("Error initializing auth:", err);
      error.value = "Error al inicializar la autenticación";
    } finally {
      loading.value = false;
    }

    // Configurar oyente para cambios de autenticación
    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user || null;
    });
  };

  // Iniciar sesión con email y contraseña
  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;
      user.value = data.user;
      return { success: true };
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);
      error.value = err.message || "Error al iniciar sesión";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    loading.value = true;

    try {
      await supabase.auth.signOut();
      user.value = null;
      return { success: true };
    } catch (err: any) {
      console.error("Error al cerrar sesión:", err);
      error.value = err.message || "Error al cerrar sesión";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    error,
    initAuth,
    login,
    logout,
    isAuthenticated: () => !!user.value,
  };
});
