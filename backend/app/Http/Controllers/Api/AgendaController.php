<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Http\Request;

class AgendaController extends Controller
{
    public function index(Request $request)
    {
        $agendas = Agenda::where('status', 'active')
            ->orderBy('tanggal', 'asc')
            ->get();

        return response()->json($agendas);
    }
}
