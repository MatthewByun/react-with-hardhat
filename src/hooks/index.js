import { useWeb3React } from "@web3-react/core";

export const useGetSigner = () => {
    const context = useWeb3React();
	const contextNetwork = useWeb3React("NETWORK");
	return context.active ? context : contextNetwork;
}