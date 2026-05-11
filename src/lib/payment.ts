/**
 * SERVICE DE PAIEMENT - PayGate Global
 */

export interface PaymentRequest {
  amount: number;       
  currency: "XOF";      
  phoneNumber: string;  
  network: "TMONEY" | "MOOV" | "CARD"; 
  projectId?: string;    
  influencerId?: string;
  donationType: "PROJECT" | "INFLUENCER";
  projectName?: string;
  donorName?: string;
  provider?: "FEDAPAY" | "PAYGATE"; // Choix du prestataire
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  paymentUrl?: string; 
}

export async function processMobilePayment(request: PaymentRequest): Promise<PaymentResponse> {
  return processPayGatePayment(request);
}

/**
 * PAYGATE GLOBAL INTEGRATION
 */
async function processPayGatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  const token = process.env.PAYGATE_AUTH_TOKEN;
  
  if (!token) {
    return {
      success: true,
      transactionId: "PG-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      message: "Initialisation en mode test."
    };
  }

  // Identifiant unique pour le suivi
  const identifier = "PG_" + Math.random().toString(36).substring(2, 10).toUpperCase();

  try {
    // PayGate Global Togo utilise souvent une redirection directe vers leur page de paiement
    // ou une API POST. Ici on prépare l'URL de redirection car c'est le plus robuste pour Mobile Money.
    const baseUrl = "https://paygateglobal.com/v1/page";
    
    // Mapping des réseaux pour PayGate (TMONEY ou FLOOZ)
    const network = request.network === "MOOV" ? "FLOOZ" : "TMONEY";

    const params = new URLSearchParams({
      token: token,
      amount: request.amount.toString(),
      description: `Soutien HOASSI - ${request.projectName || "Projet"}`,
      identifier: identifier,
      url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/project/${request.projectId || ""}`
    });

    const paymentUrl = `${baseUrl}?${params.toString()}`;

    return {
      success: true,
      transactionId: identifier,
      message: "Initialisation PayGate réussie.",
      paymentUrl: paymentUrl
    };

  } catch (error: any) {
    console.error("[PayGate] Exception:", error.message);
    return {
      success: false,
      message: "Erreur technique lors de l'initialisation PayGate."
    };
  }
}
