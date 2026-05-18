from pathlib import Path

try:
    import numpy as np
except ImportError:
    raise SystemExit("Missing dependency: numpy. Install it with: pip install numpy matplotlib")

try:
    import matplotlib.pyplot as plt
except ImportError:
    raise SystemExit("Missing dependency: matplotlib. Install it with: pip install matplotlib")


def get_positional_embeddings(sequence_length: int, d_model: int) -> np.ndarray:
    positions = np.arange(sequence_length, dtype=np.float32)[:, np.newaxis]
    div_terms = np.exp(np.arange(0, d_model, 2, dtype=np.float32) * (-np.log(10000.0) / d_model))

    embeddings = np.zeros((sequence_length, d_model), dtype=np.float32)
    embeddings[:, 0::2] = np.sin(positions * div_terms)
    embeddings[:, 1::2] = np.cos(positions * div_terms)
    return embeddings


if __name__ == "__main__":
    output_path = Path(__file__).resolve().parent / "positional_encoding.png"
    image = get_positional_embeddings(100, 300)

    plt.figure(figsize=(7, 4.5), dpi=200)
    plt.imshow(image, cmap="hot", interpolation="nearest", aspect="auto")
    plt.xlabel("Embedding dimension")
    plt.ylabel("Token position")
    plt.title("Sinusoidal Positional Encoding")
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches="tight")
    plt.show()

    print(f"Saved positional encoding figure to: {output_path}")
