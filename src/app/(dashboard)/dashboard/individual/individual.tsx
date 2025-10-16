"use client";

import { CalendarClock, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function IndividualPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
      <Card className="max-w-lg w-full text-center shadow-xl border border-indigo-100 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-indigo-700 flex justify-center items-center gap-3">
            <CalendarClock className="w-8 h-8 text-indigo-600" />
            Terapia Individual
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full blur-lg opacity-20"></div>
              <div className="relative bg-white shadow-md rounded-full p-6">
                <Sparkles className="w-10 h-10 text-indigo-600" />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800">¡Próximamente!</h2>
            <p className="text-gray-600 max-w-md">
              Estamos preparando algo especial para ti. Muy pronto podrás agendar tus
              sesiones de terapia individual con nuestros especialistas.
            </p>

            <Button
              disabled
              className="bg-indigo-500 text-white cursor-not-allowed opacity-60 mt-4"
            >
              Próximamente disponible
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
