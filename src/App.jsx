import { useState, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import "./App.css";
import groupedQuizzes from "./quizzes_grouped.json";

const QUIZ_BANK_OLD = [
  {
    "id": "jku_ml_2024",
    "title": "Hands on AI Exam — JKU June 2024",
    "description": "Neural networks, RNNs, LSTMs, RL, drug discovery",
    "questions": [
      {
        "q": "Which statements are true about QSAR?",
        "opts": [
          "The bio-activity is determined by the molecular structure.",
          "The hypothesis is that similar molecular structures have similar activities.",
          "The hypothesis is that similar activities have similar molecular structures.",
          "The molecular structure is determined by the bio-activity."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "Which are typical activation functions in neural networks?",
        "opts": [
          "Tanh",
          "SELU",
          "Leaky ReLU",
          "Sigmoid"
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements are true about many-to-one RNN types?",
        "opts": [
          "Given Tx=5, output length Ty=Tx.",
          "Given input length Tx, output length is always 1.",
          "Suitable where each input maps to one output.",
          "Suitable where entire input is needed to predict a single output."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "In a 20×20 RL grid (4 moves, off-grid penalty -5, target +20), which are true?",
        "opts": [
          "There are policies that never reach the target.",
          "There are policies that reach target but have final reward < 20.",
          "Policies A and B can both be optimal despite different total steps.",
          "An optimal policy will give a final reward of 20."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about self-attention in language models are true?",
        "opts": [
          "Self-attention creates contextualized word embeddings.",
          "Self-attention allows the model to weigh importance of different words.",
          "Self-attention only works for short sentences.",
          "Self-attention helps capture long-range dependencies."
        ],
        "ans": [
          0,
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about virtual screening (VS) are true?",
        "opts": [
          "A trained NN searches the whole chemical universe.",
          "A trained NN predicts if a molecule is likely to bind/react with the target.",
          "A trained NN predicts the 3D configuration of a protein.",
          "A trained NN creates new molecules with specified bio-activity."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which are parts of a Markov decision process?",
        "opts": [
          "A set of possible state transitions.",
          "A set of possible q-values.",
          "A set of possible rewards.",
          "A set of possible states."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "The 3D structure of a molecule ...",
        "opts": [
          "... can be different for the same molecular graph.",
          "... can be easily determined experimentally.",
          "... can be inferred from the SMILES representation.",
          "... determines its functionality."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "What is the data flow through a Transformer language model?",
        "opts": [
          "input → feed-forward → self-attention → embedding → output",
          "input → embedding → feed-forward → self-attention → output",
          "input → self-attention → embedding → feed-forward → output",
          "input → embedding → self-attention → feed-forward → output"
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Dictionary=5000, embedding=200, hidden=300. Output size for a single word?",
        "opts": [
          "300",
          "5000",
          "200",
          "400"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Backpropagation through time ...",
        "opts": [
          "... is the method used to train RNNs.",
          "... mitigates the vanishing gradient problem.",
          "... cannot be used when input exceeds a maximum length.",
          "... means different weights are used for every timestep."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "A 100×100 grayscale image with 3 kernels of 5×5 (no padding) produces ...",
        "opts": [
          "... three output feature maps.",
          "... a 5×5 kernel cannot be applied to 100×100.",
          "... one output feature map with average of three channels.",
          "... output resolution of 96×96."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about the vanishing gradient problem are true?",
        "opts": [
          "Gradients > 1 repeated → exploding gradient.",
          "Normalizing inputs mitigates vanishing gradients.",
          "Gradients < 1 repeated → vanishing gradient.",
          "Vanishing gradient occurs more in classification than regression."
        ],
        "ans": [
          0,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about gradient descent are true?",
        "opts": [
          "It might get stuck at a local minimum.",
          "Initial parameter values can be chosen randomly.",
          "It can update weights of neural networks.",
          "It is an analytical method."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Comparing LSTM to a standard RNN, which are true?",
        "opts": [
          "LSTM generally performs better irrespective of sequence length.",
          "LSTM is less prone to the vanishing gradient problem.",
          "Standard RNN is computationally more efficient.",
          "Standard RNN has fewer model parameters."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about attention mechanisms are true?",
        "opts": [
          "They reduce computational complexity.",
          "They reduce the number of parameters to train.",
          "They help the model focus on relevant parts of the input.",
          "They require a fixed-size input sequence."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "What are typical challenges in traditional drug discovery?",
        "opts": [
          "It is very time-consuming.",
          "Success rates are about 50%.",
          "It is an expensive process.",
          "Finding suitable molecules is difficult due to the huge candidate space."
        ],
        "ans": [
          0,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "In classification ...",
        "opts": [
          "... target value must be a string of characters.",
          "... target value is a class label.",
          "... we use Mean Squared Error Loss.",
          "... there can only be two classes."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which statements about the tanh activation function are true?",
        "opts": [
          "tanh is not differentiable for some inputs.",
          "Its derivative is small for very large positive inputs.",
          "Derivative for negative inputs is -1.",
          "Maximum derivative value is at input 0."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Deep networks and vanishing gradients — which are true?",
        "opts": [
          "Deeper networks → more multiplications in backward pass.",
          "Increasing learning rate mitigates vanishing gradients in deep nets.",
          "Vanishing gradient typically occurs near the output layer.",
          "Choice of activation function does not affect the problem."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "In CNNs, weight sharing means ...",
        "opts": [
          "... kernel applied to one position, weights fixed.",
          "... kernel applied to one position, weights updated continuously.",
          "... kernel applied to all positions, weights updated continuously.",
          "... kernel applied to all positions, weights fixed."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "A non-convex function ...",
        "opts": [
          "... can have several local minima.",
          "... typically has no closed-form solution.",
          "... often requires iterative methods for minimum.",
          "... is common in deep learning."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Dictionary=1000, embedding=150, hidden=100. Which are true for a single word input?",
        "opts": [
          "Model output probabilities sum to 1.",
          "Embedding and decoder matrices have equally many parameters.",
          "Embedding matrix is identical to decoder matrix.",
          "Decoder output size is 1000."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "In a Markov decision process ...",
        "opts": [
          "... positive reward always given for desirable state.",
          "... rewards can be 0.",
          "... negative rewards are possible.",
          "... next action depends on all previous states."
        ],
        "ans": [
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about Q-learning are true?",
        "opts": [
          "Q-learning is one implementation of reinforcement learning.",
          "Major advantage: computationally efficient for larger MDPs.",
          "Deep Q-learning approximates the Q-value function.",
          "Q-learning can be applied to any MDP."
        ],
        "ans": [
          0,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about data normalization are true?",
        "opts": [
          "It can improve ML model performance.",
          "It is only useful for image data.",
          "It standardizes the range of features.",
          "It increases the range of data."
        ],
        "ans": [
          0,
          2
        ],
        "multi": true
      },
      {
        "q": "In Q-learning, which statements about choosing actions are true?",
        "opts": [
          "Action can be chosen randomly.",
          "Action can be chosen based on highest Q-value.",
          "A suboptimal action might cause Q-learning to get stuck.",
          "'Exploration' and 'Exploitation' are action strategies."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Sequence of 20 elements, 5 features each, single-layer RNN with hidden size 10. Size of first output?",
        "opts": [
          "10",
          "25",
          "5",
          "20"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "σ'(x) is the sigmoid derivative. y = σ'(500) × σ'(-200). Which is correct?",
        "opts": [
          "y ≈ 1/16",
          "y ≈ 1",
          "y ≈ 0",
          "y < 0"
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Which activation functions are prone to the vanishing gradient problem?",
        "opts": [
          "Leaky ReLU",
          "Hardsigmoid",
          "Tanh",
          "Sigmoid"
        ],
        "ans": [
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "The forget gate in an LSTM ...",
        "opts": [
          "... determines the final output of the LSTM cell.",
          "... adds new information to the cell state.",
          "... decides what information to discard from the cell state.",
          "... is crucial for controlling the cell state."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Q(s,a) ← (1-α)·Q(s,a) + α·(r + γ·max Q(s',a')). Which are true?",
        "opts": [
          "α=0 means only new information is used.",
          "α=1 means only new information is used.",
          "α is the learning rate.",
          "r is the expected long-term reward."
        ],
        "ans": [
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about LSTM networks are true?",
        "opts": [
          "Not suitable for sequential data.",
          "Contain gates that control information flow.",
          "Designed to remember information long-term.",
          "Less complex than standard RNNs."
        ],
        "ans": [
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about SMILES are true?",
        "opts": [
          "SMILES captures 3D structural information.",
          "It is a string sequence representation of a molecule.",
          "SMILES is one of many molecular representations.",
          "A molecule can have different SMILES representations."
        ],
        "ans": [
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about an optimal policy are true?",
        "opts": [
          "It maximizes cumulative reward.",
          "Choosing highest immediate reward doesn't necessarily lead to optimal policy.",
          "Q-learning is an optimal policy.",
          "There can be multiple optimal policies."
        ],
        "ans": [
          0,
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Correct formula for forward pass (input x, weights W, bias b, activation f)?",
        "opts": [
          "output = x · f(W + b)",
          "output = f(x · W) + b",
          "output = f(x · W + b)",
          "output = f(x) · W + b"
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Which statements about overfitting are true?",
        "opts": [
          "Overfitting means the model won't generalize well.",
          "Overfitting can be mitigated by a different loss function.",
          "Overfitting occurs when loss decreases linearly over epochs.",
          "Overfitting occurs when train and test loss differ significantly."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      }
    ]
  },
  {
    "id": "jku_retry_sep2023",
    "title": "Hands on AI Retry Exam — JKU Sep 2023",
    "description": "Q-learning, data augmentation, protein folding, CNNs, RNNs",
    "questions": [
      {
        "q": "Q-learning update: Q(s,a)←(1-α)Q(s,a)+α(r+γ max Q(s',a')). Which are true?",
        "opts": [
          "α=1 means no update is performed.",
          "γ=0 means only take the immediate reward into account.",
          "α is the discount factor.",
          "γ=1 means put strong emphasis on future rewards."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about data augmentation are true?",
        "opts": [
          "Not every augmentation technique is useful in every scenario.",
          "Data augmentation might reduce overfitting.",
          "Data augmentation is useful to artificially create more samples.",
          "Data augmentation is useful to decrease variation in the data."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Sequence of 50 elements, 9 features each, single-layer RNN with hidden size 12. Size of first output?",
        "opts": [
          "12",
          "600",
          "9",
          "50"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Correct formula for forward pass (input x, weights W, bias b, activation f)?",
        "opts": [
          "output = f(x * W + b)",
          "output = f(x) * W + b",
          "output = x * f(W + b)",
          "output = f(x * W) + b"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "The protein folding problem deals with ...",
        "opts": [
          "... predicting the amino acid sequence from 3D structure.",
          "... predicting biological functionality from 3D structure.",
          "... predicting the 3D structure from the amino acid sequence.",
          "... determining how to fold a protein for desired functionality."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "In gradient descent ...",
        "opts": [
          "... small gradients mean the learning rate was chosen incorrectly.",
          "... new param value = old param value minus learning rate × gradient of loss.",
          "... convergence indicates a global minimum has been found.",
          "... the learning rate determines the step size."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about generative models in drug discovery are true?",
        "opts": [
          "Generative models replace virtual screening models.",
          "Generative models generate new bioactivities for existing molecules.",
          "Generative models are promising since the chemical universe is too big for standard techniques.",
          "Generative models generate new molecules according to target bioactivity."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Vanishing gradient in deep networks — which are true?",
        "opts": [
          "Deeper network → more chain-rule multiplications in backward pass.",
          "The used activation functions play a significant role.",
          "Vanishing gradient typically occurs towards the input layer.",
          "Deep networks will always suffer from vanishing gradient."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "A non-convex function ...",
        "opts": [
          "... is extremely rare in deep learning.",
          "... always has a closed-form solution.",
          "... often requires iterative methods for minimum.",
          "... often has multiple local minima."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Convolution of a 12×12 image with 4 channels using 2 kernels of size 3×3 produces ...",
        "opts": [
          "... an output with 3 feature maps.",
          "... an output with 12 feature maps.",
          "... an output with 2 feature maps.",
          "... an output with 4 feature maps."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Gating in an LSTM selects important information ...",
        "opts": [
          "... by element-wise multiplication with a number between -1 (closed) and +1 (open).",
          "... by element-wise multiplication with a number between 0 (closed) and +1 (open).",
          "... by comparing the feature vector with the accompanying target.",
          "... by combining the feature vector with output of previous timestep."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Why is it a good idea to have a separate test set?",
        "opts": [
          "It allows a better estimate of the generalization error.",
          "It enables the use of different model architectures.",
          "Empirical risk minimization can be performed on two datasets.",
          "It allows to detect overfitting."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about recurrent neural networks are true?",
        "opts": [
          "They incorporate information from the current timestep only.",
          "They are suitable for processing sequences of fixed length.",
          "They are suitable for processing sequences of variable length.",
          "They incorporate information from previous timesteps."
        ],
        "ans": [
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "In a Markov decision process ...",
        "opts": [
          "... rewards can be positive.",
          "... rewards can be 0.",
          "... rewards can be negative.",
          "... reward is associated with transition from one state to another."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about gating/gates in an LSTM are true?",
        "opts": [
          "All gates are optional.",
          "Gates depend on the current input and the past.",
          "Typically, sigmoid is used as gate function.",
          "Gating controls what to read/write/forget in memory."
        ],
        "ans": [
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about QSAR are true?",
        "opts": [
          "The hypothesis is that similar molecular structures have similar activities.",
          "The hypothesis is that similar activities have similar molecular structures.",
          "The molecular structure is determined by the bio-activity.",
          "The bio-activity is determined by the molecular structure."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about the one-to-many RNN type are true?",
        "opts": [
          "Given input Tx=1, output length Ty>1.",
          "Given input Tx>1, output length Ty=1.",
          "Given input Tx>1, output length Ty>1.",
          "Given input Tx=1, output length Ty=1."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "What is the general data flow through an RNN language model?",
        "opts": [
          "input → encoder → RNN → decoder",
          "input → RNN → encoder → decoder",
          "input → decoder → RNN → encoder",
          "input → encoder → decoder → RNN"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which statements about activation functions in neural networks are true?",
        "opts": [
          "Activation functions introduce non-linearity.",
          "Activation functions enable stacking of multiple network layers.",
          "Different activation functions might lead to different training results.",
          "After training, activation functions can be discarded."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "In the context of language models, which statements about an embedding are true?",
        "opts": [
          "The decoder part is closely related to a word embedding.",
          "The encoder part is closely related to a word embedding.",
          "An embedding is a compact string representation of words.",
          "An embedding contains probabilities of a word occurring in a corpus."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which statements about translation invariance are true?",
        "opts": [
          "It refers to the problem where networks learn to ignore object position.",
          "In neural networks, it can be implemented via convolutional layers.",
          "It is desirable for models that classify content of natural images.",
          "In deep networks, it indicates similar gradient magnitudes across layers."
        ],
        "ans": [
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "The original CEC (constant error carousel) of an LSTM ...",
        "opts": [
          "... can mitigate the vanishing gradient problem.",
          "... uses non-linear functions to modify the cell state.",
          "... is an optional part.",
          "... is influenced by the introduction of the forget gate."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Back-propagation through time allows ...",
        "opts": [
          "... mitigation of vanishing gradients in unrolled RNNs.",
          "... an RNN to process input in reversed order.",
          "... calculation of the gradient of the loss w.r.t. RNN's weights.",
          "... an RNN to recall previously seen sequence elements."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Which statements about reinforcement learning are true?",
        "opts": [
          "The goal is to learn the optimal policy.",
          "A RL problem can be formulated as a Markov decision process.",
          "Often, initial knowledge about transition probabilities is missing.",
          "Games are one of many application areas."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Dictionary=12000, embedding=350, hidden=300. Output size for a single word?",
        "opts": [
          "350",
          "12000",
          "300",
          "300×350=105000"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "The 3D structure of a molecule ...",
        "opts": [
          "... is expensive to determine experimentally.",
          "... is independent of the molecule's functionality.",
          "... is unambiguously determined by a molecular graph.",
          "... is straightforward to predict if sequence of atoms is known."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which statements about the ReLU activation function are true?",
        "opts": [
          "For positive inputs, ReLU is equivalent to Leaky ReLU.",
          "The derivative is easy to compute.",
          "For negative inputs, the derivative is 0.",
          "For positive inputs, ReLU equates to the identity function."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about the concept of an optimal policy are true?",
        "opts": [
          "It minimizes the sum of rewards.",
          "Applying optimal policy means maximizing immediate reward.",
          "The optimal policy may be obtained via Q-learning.",
          "There can be multiple optimal policies."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about SMILES are true?",
        "opts": [
          "A molecule can have different SMILES representations.",
          "A molecule can only have exactly one SMILES representation.",
          "A molecular graph can be transformed into SMILES and vice versa.",
          "It is a tabular data representation."
        ],
        "ans": [
          0,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about the vanishing gradient problem are true?",
        "opts": [
          "Repeated multiplication of gradients > 1 → vanishing gradient.",
          "To avoid the problem, gradients should ideally be 0.",
          "Repeated multiplication of gradients < 1 → vanishing gradient.",
          "Vanishing gradients make training of a NN extremely difficult."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about RNN language models are true?",
        "opts": [
          "The overall loss is the average loss over the entire training set.",
          "At each position, a loss is calculated based on decoder's prediction for next word.",
          "At end of sequence, one final loss is calculated based on sequence overlap.",
          "The overall loss is often calculated over mini-batches."
        ],
        "ans": [
          0,
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about sequence data and feed-forward neural networks are true?",
        "opts": [
          "If sequence length is equal, feed-forward NN behaves same as RNN.",
          "Sequence data cannot be an input to a feed-forward NN.",
          "Sequences with variable lengths must be preprocessed.",
          "The relation of elements in the sequence is lost."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Dictionary=5000, embedding=400, hidden=400. Which are true for a single word input?",
        "opts": [
          "The encoder and decoder matrices have equally many parameters.",
          "The encoder matrix is identical to the decoder matrix.",
          "The decoder results in an output of size 400.",
          "The maximum input sequence length is 400."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which activation functions can be used to mitigate the vanishing gradient problem?",
        "opts": [
          "Sigmoid",
          "SELU",
          "ReLU",
          "Tanh"
        ],
        "ans": [
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "The goal of Q-learning is to ...",
        "opts": [
          "... find the optimal degree of exploration and exploitation.",
          "... predict the agent's next action based on previous actions.",
          "... approximate the expected reward for the next state-transition.",
          "... approximate the Q-values of state-action pairs of an MDP."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "RL scenario: 6×6 grid, reward -1 per move, +1 at target. Which are true?",
        "opts": [
          "With a bad policy, target might not be reached at all.",
          "Maximum steps of any policy is 6×6×4=144.",
          "All target-reaching policies have the same aggregated reward.",
          "An optimal policy always has aggregated positive reward for every starting state."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "In regression ...",
        "opts": [
          "... the target value is numeric.",
          "... there can only be multiple classes.",
          "... we are dealing with unsupervised learning.",
          "... the target value is a class label."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which statements about tabular data are true?",
        "opts": [
          "Tabular data can only be used in supervised learning.",
          "Tabular data might contain duplicate rows.",
          "In principle, images can be stored in tabular form.",
          "Rows in the table are called samples."
        ],
        "ans": [
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about virtual screening (VS) are true?",
        "opts": [
          "In VS, a trained NN predicts whether a molecule is likely to bind/react with the target.",
          "In VS, a trained NN predicts the most relevant target molecule.",
          "In VS, a trained NN virtually searches the whole chemical universe.",
          "In VS, a trained NN predicts the toxicity of a drug."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "y = σ'(-400) × σ'(300). Which is correct?",
        "opts": [
          "y is close to 1/4.",
          "y is close to 0.",
          "y is close to 1/16.",
          "y is close to 1."
        ],
        "ans": [
          1
        ],
        "multi": false
      }
    ]
  },
  {
    "id": "jku_retry2_sep2024",
    "title": "Hands on AI Retry Exam 2 — JKU Sep 2024",
    "description": "Convex functions, RL, LSTM gates, CNNs, Transformers, dimensionality reduction",
    "questions": [
      {
        "q": "A convex function ...",
        "opts": [
          "... sometimes has an analytical solution for computing its minimum.",
          "... always has an analytical solution for computing its minimum.",
          "... can have several local minima.",
          "... can also be solved iteratively (e.g., via gradient descent)."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "RL scenario: 5×5 grid, reward -2 per move, +15 at target. Which are true?",
        "opts": [
          "Maximum steps of an optimal policy is 8.",
          "With a bad policy, target might not be reached at all.",
          "An optimal policy always has aggregated positive reward for every starting state.",
          "Maximum steps of any policy is 5×5×4=100."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "Sequence of 8 elements, 10 features each, single-layer RNN with hidden size 6. Size of first output?",
        "opts": [
          "16",
          "48",
          "4",
          "6"
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Back-propagation through time ...",
        "opts": [
          "... allows mitigation of vanishing gradients in unrolled RNNs.",
          "... is commonly used to train an RNN.",
          "... generates potentially very wide (but not deep) networks.",
          "... is the cause of vanishing gradients in RNNs."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Sequence data s of length T with D features at every timestep t. Which are true about different samples?",
        "opts": [
          "D is constant between samples.",
          "For one specific sample, t can be greater than T.",
          "T is constant between samples.",
          "D can vary between samples."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Q-learning update: Q(s,a)←(1-α)Q(s,a)+α(r+γ max Q(s',a')). Which are true?",
        "opts": [
          "α is the learning rate.",
          "α=1 means no update at all is performed.",
          "0<α<1 means both old Q-value and new information are used.",
          "α=0 means no update at all is performed."
        ],
        "ans": [
          0,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Gating in an LSTM selects important information ...",
        "opts": [
          "... by element-wise multiplication between -1 (closed) and +1 (open).",
          "... by element-wise multiplication between 0 (closed) and +1 (open).",
          "... by element-wise comparison to previous timestep feature vector.",
          "... by averaging all elements and applying a threshold between 0 and 1."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "In a Markov decision process ...",
        "opts": [
          "... rewards can be 0.",
          "... rewards can be positive.",
          "... reward is associated with the transition from one state to another.",
          "... rewards can be negative."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "In CNNs, which statements about convolutional layers are true?",
        "opts": [
          "Input values must be normalized to range 0 and 1.",
          "Weight sharing means several kernels are applied to all positions using same weights per kernel.",
          "A convolutional layer might reduce the resolution of the image.",
          "There must be more output feature maps than input feature maps."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "In the context of language models, which statements about an embedding are true?",
        "opts": [
          "Elements in a word embedding are not allowed to have any relationship with each other.",
          "The encoder part of a language model is closely related to a word embedding.",
          "An embedding contains the frequency of a word occurring in a text corpus.",
          "An embedding is a mapping of a word to similar words."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "In the forward pass of a neural network, the input vector is ...",
        "opts": [
          "... passed through element-wise non-linearity, multiplied by weight matrix and added to bias.",
          "... added to bias weights, multiplied by weight matrix and passed through non-linearity.",
          "... multiplied by a weight matrix, added to bias weights and passed through element-wise non-linearity.",
          "... passed through element-wise non-linearity, added to bias weights and multiplied by weight matrix."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Max-pooling ...",
        "opts": [
          "... involves trainable parameters.",
          "... is a form of subsampling.",
          "... may decrease the spatial size of the data.",
          "... eases the computational demand."
        ],
        "ans": [
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Softmax ...",
        "opts": [
          "... is a generalization of the tanh function.",
          "... is a method to compute probabilities.",
          "... can only be used if there are more than 2 classes.",
          "... is computed with the formula e^zi / sum(e^zj)."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "The 3D structure of a molecule ...",
        "opts": [
          "... is ambiguously determined by a molecular graph.",
          "... can be inferred from the SMILES representation.",
          "... is independent of the molecule's functionality.",
          "... can be experimentally determined."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Convolution of a 30×30 image with 3 channels using 5 kernels of 5×5 produces ...",
        "opts": [
          "... an output with 5 feature maps.",
          "... an output with 3×5=15 feature maps.",
          "... an output with 1 feature map.",
          "... an output with (30×30)/(5×5)=36 feature maps."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "The output gate of an LSTM ...",
        "opts": [
          "... is typically ReLU activated.",
          "... will determine the next cell state.",
          "... will determine the output of the Constant Error Carousel (CEC).",
          "... will determine the next hidden state of the LSTM."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "The tanh function tanh(x) ...",
        "opts": [
          "... scales values to the range (0, 1).",
          "... scales values to the range (-1, 1).",
          "... scales values to the range (-x, x).",
          "... scales values to the range (0, x)."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Problems of RNN-based language models compared to Transformer models?",
        "opts": [
          "LSTMs can have problems capturing contextual information for long sequences.",
          "Word embeddings can have lower dimensionality in Transformer models.",
          "Transformer models have a lower parameter count.",
          "RNN based models cannot be computed in parallel."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "What is the general data flow through a Transformer language model?",
        "opts": [
          "input → Self-Attention → encoder → Feed-Forward → decoder",
          "input → encoder → Self-Attention → Feed-Forward → decoder",
          "input → decoder → Feed-Forward → Self-Attention → encoder",
          "input → encoder → Feed-Forward → Self-Attention → decoder"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which statements about (deep) Q-learning are true?",
        "opts": [
          "Deep Q-learning is about approximating the Q-value function.",
          "Deep Q-learning is often necessary for larger MDPs.",
          "Q-learning is an implementation of reinforcement learning.",
          "Q-learning can be applied to any MDP."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about dimensionality reduction are true?",
        "opts": [
          "If very high dimensional, dimensionality reduction must be applied before model training.",
          "One popular algorithm is k-means.",
          "Information will be lost by downprojecting data to e.g. 2 dimensions.",
          "Dimensionality reduction techniques are useful for visualizing high dimensional data."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about gating/gates in an LSTM are true?",
        "opts": [
          "Typically, ReLU is used as gate function.",
          "Gates are not affected by gradient computations.",
          "All gates are optional.",
          "Gates depend on the current input and the past."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Which statements about gradient descent are true?",
        "opts": [
          "It might converge to a local minimum.",
          "It is an iterative method.",
          "The initial starting value of a parameter can be chosen randomly.",
          "The learning rate influences how much the value of a parameter changes."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about high throughput screening (HTS) are true?",
        "opts": [
          "In HTS, a trained NN predicts the 3D structure of a molecule.",
          "In HTS, a trained NN predicts whether a molecule is likely to bind/react with the target.",
          "In HTS, a trained NN predicts the most relevant target molecule.",
          "In HTS, is an expensive and time consuming process."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Which statements about language models are true?",
        "opts": [
          "Language modeling is the task of predicting a context given a word.",
          "Language modeling is the task of predicting a word given a context.",
          "Language modeling is the task of predicting a previously unseen word.",
          "Language modeling is the task of predicting the importance of words."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which statements about QSAR are true?",
        "opts": [
          "The molecule structure is determined by the bioactivity.",
          "The hypothesis is that similar activities have similar molecular structures.",
          "The hypothesis is that similar molecular structures have similar activities.",
          "The bioactivity is determined by the molecule structure."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about recurrent neural networks are true?",
        "opts": [
          "They incorporate information from previous timesteps of a sequence.",
          "They are suitable for processing sequences of fixed length.",
          "They are suitable for processing sequences of variable length.",
          "They are the same as regular feed-forward NNs if sequence length is fixed."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about RNN language models are true?",
        "opts": [
          "An encoder is used to represent each word via a word embedding.",
          "The RNN inputs are the decoder output at current position and RNN output at previous position.",
          "At each position in a sequence, a loss is calculated based on decoder's prediction for next word.",
          "Loss is typically measured with negative log likelihood, as it is essentially a classification problem."
        ],
        "ans": [
          0,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about sequence data are true?",
        "opts": [
          "Sequence data is typically displayed in line plots.",
          "There are dedicated ML models that deal with sequence data.",
          "Typically, there is some sort of order in the data (time, position, etc.).",
          "Sequence data cannot be meaningfully displayed in tabular form."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about sequence data input and feed-forward neural networks are true?",
        "opts": [
          "Sequence data cannot be an input to a feed-forward neural network.",
          "Sequences with variable lengths must be preprocessed before input.",
          "If the sequence length is equal, a feed-forward NN behaves same as RNN.",
          "The relation of elements in the sequence is lost."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about SMILES are true?",
        "opts": [
          "It is a tabular data representation of a molecule.",
          "SMILES representations are unique.",
          "A molecular graph can be transformed into a SMILES string and vice versa.",
          "A molecule can have different SMILES representations."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about the concept of an optimal policy are true?",
        "opts": [
          "It minimizes the sum of rewards.",
          "The optimal policy may be obtained via Q-learning.",
          "There exists exactly one optimal policy.",
          "Applying the optimal policy essentially means to maximize the immediate reward."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which statements about the one-to-one RNN type are true?",
        "opts": [
          "Given input Tx=1, output length Ty=1.",
          "Given input Tx=1, output length Ty>1.",
          "Given input Tx>1, output length Ty=1.",
          "Given input Tx>1, output length Ty>1."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which statements about the ReLU activation function are true?",
        "opts": [
          "For positive inputs, ReLU increases linearly.",
          "ReLU is computationally cheap.",
          "For negative inputs, ReLU equates to values close to 1.",
          "ReLUs can cause the vanishing gradient problem."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "Which statements about the vanishing gradient problem are true?",
        "opts": [
          "Vanishing gradient can be mitigated by rescaling input values.",
          "Repeated multiplication of gradients smaller than 1 leads to vanishing gradient.",
          "The main culprit is using a 'problematic' activation function such as sigmoid.",
          "Vanishing gradient can be reduced by decreasing number of nodes in hidden layers."
        ],
        "ans": [
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about the weights of an RNN are true?",
        "opts": [
          "For each timestep, the same (shared) weight matrix is used.",
          "The size of the weight matrix is independent of the sequence length.",
          "For sequences of different length, multiple shared weight matrices must be learned.",
          "For each timestep, a dedicated weight matrix is used."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "y = σ'(2×x + 25), x=10. Which are correct?",
        "opts": [
          "y is in the range (0, 1).",
          "y is close to 0.",
          "y is close to x.",
          "y is in the range (0, 1/4)."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      }
    ]
  },
  {
    "id": "jku_retry_2024_paper",
    "title": "Hands on AI Retry Exam — JKU 2024 (Paper)",
    "description": "Molecular graphs, drug discovery, dropout, L2 regularization, and more",
    "questions": [
      {
        "q": "Which statements about molecular graphs are correct?",
        "opts": [
          "They have labeled edges.",
          "They are directed.",
          "They have labeled nodes.",
          "They cannot encode 3D information."
        ],
        "ans": [
          0,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about QSAR are true?",
        "opts": [
          "The hypothesis is that similar activities have similar molecular structures.",
          "The molecule structure is determined by the bioactivity.",
          "The bioactivity is determined by the molecule structure.",
          "The hypothesis is that similar molecular structures have similar activities."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about the vanishing gradient problem are true?",
        "opts": [
          "Repeated multiplication of gradients < 1 leads to a vanishing gradient.",
          "The vanishing gradient problem can be mitigated by rescaling input values.",
          "The vanishing gradient problem can be reduced by decreasing number of nodes.",
          "The main culprit of a vanishing gradient is using a 'problematic' activation function such as sigmoid."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about high throughput screening (HTS) are true?",
        "opts": [
          "In HTS, a trained NN predicts whether a molecule is likely to bind/react with the target.",
          "In HTS, a trained NN predicts the 3D structure of a molecule.",
          "HTS is an expensive and time-consuming process.",
          "In HTS, a trained NN predicts the most relevant target molecule for a drug against a specific disease."
        ],
        "ans": [
          0,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about sequence data and feed-forward neural networks are true?",
        "opts": [
          "The relation of elements in the sequence is lost.",
          "Sequences with variable lengths must be preprocessed before input.",
          "Sequence data cannot be an input to a feed-forward neural network.",
          "If sequence length is equal, a feed-forward NN behaves same as a recurrent NN."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "In the context of language models, which statements about an embedding are true?",
        "opts": [
          "An embedding contains the frequency of a word occurring in a text corpus.",
          "An embedding is a mapping of a word to similar words.",
          "Elements in a word embedding are not allowed to have any relationship with each other.",
          "The encoder part of a language model is closely related to a word embedding."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Which architectures/techniques can be used for generative modeling in Drug Discovery?",
        "opts": [
          "Convolutional Neural Networks",
          "Reinforcement Learning",
          "Variational Autoencoders",
          "Generative Adversarial Networks"
        ],
        "ans": [
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "RL scenario: 5×5 grid, reward -2 per move, +15 at target. Which are true?",
        "opts": [
          "With a bad policy, target might not be reached at all.",
          "Maximum steps of any policy is 5×5×4=100.",
          "Maximum steps of an optimal policy is 8.",
          "An optimal policy always has aggregated positive reward for every starting state."
        ],
        "ans": [
          0,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about SMILES are true?",
        "opts": [
          "A molecular graph can be transformed into a SMILES string and vice versa.",
          "SMILES representations are unique.",
          "It is a tabular data representation of a molecule.",
          "A molecule can have different SMILES representations."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "What is the general data flow through a Transformer language model?",
        "opts": [
          "input → encoder → feed-forward → self-attention → decoder",
          "input → self-attention → encoder → feed-forward → decoder",
          "input → decoder → feed-forward → self-attention → encoder",
          "input → encoder → self-attention → feed-forward → decoder"
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Which statements about the concept of an optimal policy are true?",
        "opts": [
          "The optimal policy may be obtained via Q-learning.",
          "It minimizes the sum of rewards.",
          "Applying the optimal policy essentially means to maximize the immediate reward.",
          "There exists exactly one optimal policy."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Problems of RNN-based language models compared to Transformer models?",
        "opts": [
          "Word embeddings can have a lower dimensionality in Transformer models.",
          "RNN based models cannot be computed in parallel.",
          "Transformer models have a lower parameter count.",
          "LSTMs based models can have problems with capturing contextual information given long input sequences."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about RNN language models are true?",
        "opts": [
          "At each position in a sequence, a loss is calculated based on decoder's prediction for next word.",
          "Loss is typically measured with negative log likelihood.",
          "The RNN inputs are the decoder output at current position and RNN output at previous position.",
          "An encoder is used to represent each word via a word embedding."
        ],
        "ans": [
          0,
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Sequence data s of length T with D features at every timestep t. Which are true?",
        "opts": [
          "D is constant between samples.",
          "D can vary between samples.",
          "T is constant between samples.",
          "For one specific sample, t can be greater than T."
        ],
        "ans": [
          0,
          2
        ],
        "multi": true
      },
      {
        "q": "Gating in an LSTM selects important information ...",
        "opts": [
          "... by averaging all elements and applying threshold between 0 and 1.",
          "... by element-wise multiplication between -1 (closed) and +1 (open).",
          "... by element-wise multiplication between 0 (closed) and +1 (open).",
          "... by element-wise comparison to feature vector of previous timestep."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Which statements about the one-to-one RNN type are true?",
        "opts": [
          "Given input Tx=1, the output length is Ty>1.",
          "Given input Tx=1, the output length is Ty=1.",
          "Given input Tx>1, the output length is Ty=1.",
          "Given input Tx>1, the output length is Ty>1."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "The tanh function tanh(x) ...",
        "opts": [
          "... scales values to the range (0, x).",
          "... scales values to the range (-x, x).",
          "... scales values to the range (0, 1).",
          "... scales values to the range (-1, 1)."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "The output gate of an LSTM ...",
        "opts": [
          "... will determine the output of the Constant Error Carousel (CEC).",
          "... will determine the next hidden state of the LSTM.",
          "... will determine the next cell state.",
          "... is typically ReLU activated."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Sequence of 8 elements, 10 features each, single-layer RNN with hidden size 6. Size of first output?",
        "opts": [
          "6",
          "16",
          "48",
          "4"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "In a Markov decision process ...",
        "opts": [
          "... reward is associated with the transition from one state to another.",
          "... rewards can be 0.",
          "... rewards can be positive.",
          "... rewards can be negative."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "In the forward pass of a neural network, the input vector is ...",
        "opts": [
          "... passed through element-wise non-linearity, multiplied by weight matrix and added to bias.",
          "... added to bias weights, multiplied by weight matrix and passed through non-linearity.",
          "... passed through element-wise non-linearity, added to bias weights and multiplied by weight matrix.",
          "... multiplied by a weight matrix, added to bias weights and passed through element-wise non-linearity."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Which statements about the ReLU activation function are true?",
        "opts": [
          "For negative inputs, ReLU equates to values close to 1.",
          "For positive inputs, ReLU increases linearly.",
          "ReLU is computationally cheap.",
          "ReLU can cause the vanishing gradient problem."
        ],
        "ans": [
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about recurrent neural networks are true?",
        "opts": [
          "They are suitable for processing sequences of variable length.",
          "They incorporate information from previous timesteps of a sequence.",
          "They are the same as regular feed-forward NNs if sequence length is fixed.",
          "They are suitable for processing sequences of fixed length."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "Softmax ...",
        "opts": [
          "... is a method to compute probabilities.",
          "... can only be used if there are more than 2 classes.",
          "... can only be applied for regression tasks.",
          "... is a generalization of the tanh function."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which statements about (deep) Q-learning are true?",
        "opts": [
          "Q-learning is an implementation of reinforcement learning.",
          "Q-learning can be applied to any MDP.",
          "Deep Q-learning is often necessary for larger MDPs.",
          "Deep Q-learning is about approximating the Q-value function."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "A convex function ...",
        "opts": [
          "... can also be solved iteratively (e.g., via gradient descent) to compute/approximate its minimum.",
          "... always has an analytical solution for computing its minimum.",
          "... can have several local minima.",
          "... sometimes has an analytical solution for computing its minimum."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about sequence data are true?",
        "opts": [
          "There are dedicated ML models that deal with sequence data.",
          "Sequence data is typically displayed in line plots.",
          "Typically, there is some sort of order in the data (time, position, etc.).",
          "Sequence data cannot be meaningfully displayed in tabular form."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about gating/gates in an LSTM are true?",
        "opts": [
          "Gates are not affected by gradient computations and therefore the vanishing gradient problem.",
          "Typically, ReLU is used as gate function.",
          "Gates depend on the current input and the past.",
          "There are optional gates."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Which statements about Dropout are correct?",
        "opts": [
          "When using dropout, no other regularization techniques can be applied.",
          "When using dropout, a certain percentage of units in a layer is randomly deactivated.",
          "Dropout typically results in lower training error rates, but helps with overfitting.",
          "As a regularization technique, dropout is only used during model training."
        ],
        "ans": [
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Q(s,a)←(1-α)Q(s,a)+α(r+γ max Q(s',a')). Which are true?",
        "opts": [
          "0<α<1 means both old Q-value and new information are used.",
          "α=1 means no update at all is performed.",
          "α=0 means no update at all is performed.",
          "α is the learning rate."
        ],
        "ans": [
          0,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about L2 regularization are true?",
        "opts": [
          "L2 regularization is given by L = L + λΣwi²",
          "L2 regularization is given by L = L + λΣ|wi|",
          "L2 regularization is also known as weight decay.",
          "L2 regularization will force the model to adopt larger weights."
        ],
        "ans": [
          0,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about language models are true?",
        "opts": [
          "Language modeling is the task of predicting the importance of words.",
          "Language modeling is the task of predicting a previously unseen word.",
          "Language modeling is the task of predicting a word given a context.",
          "Language modeling is the task of predicting a context given a word."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Back-propagation through time ...",
        "opts": [
          "... generates (potentially) very wide (but not deep) networks.",
          "... allows the mitigation of the vanishing gradients problem in unrolled RNNs.",
          "... is commonly used to train an RNN.",
          "... is the cause of vanishing gradients in RNNs."
        ],
        "ans": [
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about gradient descent are true?",
        "opts": [
          "It might converge to a local minimum.",
          "The initial starting value of a parameter can be chosen randomly.",
          "The learning rate influences how much the value of a parameter changes.",
          "It is an iterative method."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "y = σ'(2×x + 25), x=10. Which are correct?",
        "opts": [
          "y is close to x.",
          "y is in the range (0, 1).",
          "y is close to 0.",
          "y is in the range (0, 1/4)."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about the weights of an RNN are true?",
        "opts": [
          "The size of the weight matrix is independent of the sequence length.",
          "For each timestep, the same (shared) weight matrix is used.",
          "For sequences of different length, multiple shared weight matrices must be learned.",
          "For each timestep, a dedicated weight matrix is used."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      }
    ]
  },
  {
    "id": "jku_retry_jul2024",
    "title": "Hands on AI Retry Exam — JKU July 2024",
    "description": "Non-convex functions, stride, word2vec, self-attention, neural networks general",
    "questions": [
      {
        "q": "A non-convex function ...",
        "opts": [
          "... might have several local minima.",
          "... is rare in deep learning.",
          "... might require gradient descent to determine the minimum.",
          "... requires considerable computational power for closed form solution."
        ],
        "ans": [
          0,
          2
        ],
        "multi": true
      },
      {
        "q": "Dictionary=12000, embedding=350, hidden=300. How many parameters does the decoder matrix have?",
        "opts": [
          "300×300=90000",
          "12000×300=3600000",
          "12000×350=4200000",
          "300×350=105000"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "RL scenario: 6×6 grid, reward -1 per move, +1 at target. Which are true?",
        "opts": [
          "All target-reaching policies have the same aggregated reward.",
          "An optimal policy always has aggregated positive reward for every starting state.",
          "The maximum steps of any policy is 6×6×4=144.",
          "With a bad policy, target might not be reached at all."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Sequence of 45 elements, 6 features each, single-layer RNN with hidden size 14. Size of first output?",
        "opts": [
          "51",
          "14",
          "45",
          "84"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Back-propagation through time allows ...",
        "opts": [
          "... an RNN to keep track of input elements at the beginning of the sequence.",
          "... to save computation time by clipping gradients at every timestep.",
          "... to optimize the parameters of an RNN.",
          "... to circumvent the Vanishing Gradient problem by skipping connections."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Q-learning update: Which are true?",
        "opts": [
          "α is the discount factor.",
          "γ=1 means put strong emphasis on future rewards.",
          "α=1 means no update at all is performed.",
          "γ=0 means only take the immediate reward into account."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Gating in an LSTM selects important information ...",
        "opts": [
          "... by combining feature vector with output of the previous timestep.",
          "... by element-wise comparison of feature vector with the accompanying target.",
          "... by element-wise multiplication between -1 (closed) and +1 (open).",
          "... by element-wise multiplication between 0 (closed) and +1 (open)."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "In a Markov decision process ...",
        "opts": [
          "... rewards can be positive.",
          "... reward is associated with the transition from one state to another.",
          "... rewards can be negative.",
          "... rewards can be 0."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "In CNNs, which statements about stride are true?",
        "opts": [
          "Increasing the stride increases the number of parameters.",
          "Increasing the stride does not affect the output dimensions.",
          "Increasing the stride reduces the spatial dimensions of the output.",
          "Increasing the stride increases the computational cost."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "In gradient descent ...",
        "opts": [
          "... a higher learning rate will lead to faster convergence.",
          "... new param value = old param value minus learning rate × gradient of loss.",
          "... small gradients mean the learning rate was chosen incorrectly.",
          "... a smaller learning rate mitigates the vanishing gradient issue."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "In regression ...",
        "opts": [
          "... the target value is numeric.",
          "... the target value can be an integer.",
          "... the target value can be a character string.",
          "... the target value can be a floating-point value."
        ],
        "ans": [
          0,
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "In the context of language models, which statements about an embedding are true?",
        "opts": [
          "The decoder part is closely related to a word embedding.",
          "An embedding is a compact string representation of words.",
          "An embedding contains the probabilities of a word occurring in a corpus.",
          "The encoder part is closely related to a word embedding."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "The 3D structure of a molecule ...",
        "opts": [
          "... is a crucial component when doing QSAR.",
          "... is expensive to determine experimentally.",
          "... can be predicted from the SMILES representation.",
          "... can be derived from the molecular graph."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Convolution of a 50×50 image with 4 channels using 2 kernels of 3×3 produces ...",
        "opts": [
          "... an output with 12 feature maps at 50×50 resolution.",
          "... an output with 2 feature maps at 48×48 resolution.",
          "... an output with 6 feature maps at 50×50 resolution.",
          "... an output with 4 feature maps at 48×48 resolution."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "The goal of Q-learning is to ...",
        "opts": [
          "... approximate the expected reward for the next state-transition.",
          "... predict the agent's next action based on previous actions.",
          "... approximate the Q-values of state-action pairs of an MDP.",
          "... find the optimal degree of exploration and exploitation."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "The original CEC (constant error carousel) of an LSTM ...",
        "opts": [
          "... uses ReLU as its activation function.",
          "... represents the long-term memory.",
          "... can mitigate the vanishing gradient problem.",
          "... is influenced by the introduction of the forget gate."
        ],
        "ans": [
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "The protein folding problem deals with ...",
        "opts": [
          "... determining how to fold a protein for desired biological functionality.",
          "... predicting biological functionality from 3D structure.",
          "... predicting the amino acid sequence from 3D structure.",
          "... predicting the 3D structure from the amino acid sequence."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "What is the general data flow through an RNN language model?",
        "opts": [
          "input → RNN → encoder → decoder",
          "input → encoder → RNN → decoder",
          "input → encoder → decoder → RNN",
          "input → decoder → RNN → encoder"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which activation functions can be used to mitigate the vanishing gradient problem?",
        "opts": [
          "Leaky ReLU",
          "SELU",
          "Tanh",
          "ReLU"
        ],
        "ans": [
          0,
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Correct formula for the backward pass (input x, weights W, bias b, activation f)?",
        "opts": [
          "gradient = x * f'(W + b)",
          "gradient = f'(x) * W + b",
          "gradient = f'(x * W + b)",
          "gradient = f'(x * W) + b"
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Which statements about generative models in drug discovery are true?",
        "opts": [
          "Generative models generate new molecules according to the target or desired bioactivity.",
          "Generative models have produced a significant number of promising compounds such as the novel antibiotic Halicin.",
          "Generative models generate protein configurations according to target molecule structure.",
          "Generative models are promising since the chemical drug universe is too big for standard techniques."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about reinforcement learning are true?",
        "opts": [
          "Often, initial knowledge about transition probabilities or rewards is missing.",
          "A RL problem can be formulated by a Markov decision process.",
          "The goal of reinforcement learning is to learn the optimal policy.",
          "Games are one of many application areas of reinforcement learning."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about tabular data are correct?",
        "opts": [
          "Sequence data cannot be stored in tabular form.",
          "In principle, images can be stored in tabular form.",
          "Rows in the table are called features.",
          "There can be more features than samples in tabular data."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about data augmentation are true?",
        "opts": [
          "Data augmentation will reduce the number of features in the data.",
          "Data augmentation can help mitigate the vanishing gradient issue.",
          "Data augmentation is useful to decrease the variation in the data.",
          "Data augmentation can help prevent overfitting."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Which statements about gating/gates in an LSTM are true?",
        "opts": [
          "Gates depend on the current input and the past.",
          "Typically, sigmoid is used as gate function.",
          "Gating is used to control what to read/write/forget in memory.",
          "The parameters of the gates are optimized during training."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about QSAR are true?",
        "opts": [
          "There is no relationship between complexity of molecule and its bioactivity.",
          "The bio-activity is determined by the molecular structure.",
          "Large and complex molecules typically show higher bioactivity.",
          "The hypothesis is that similar molecular structures have similar activities."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about recurrent neural networks are true?",
        "opts": [
          "They incorporate information from previous timesteps.",
          "They are suitable for processing sequences of variable length.",
          "They are suitable for processing sequences of fixed length.",
          "They incorporate information from the current timestep."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about RNN language models are true?",
        "opts": [
          "The overall loss is often calculated over mini-batches.",
          "At each position, a loss is calculated based on decoder's prediction for next word.",
          "At end of sequence, one final loss is calculated based on sequence overlap.",
          "The overall loss is the average loss values over the entire training set."
        ],
        "ans": [
          0,
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about sequence data and feed-forward neural networks are true?",
        "opts": [
          "If sequence length is equal, a feed-forward NN behaves same as a recurrent NN.",
          "Sequences with variable lengths must be preprocessed before input.",
          "The relation of elements in the sequence is lost.",
          "Sequence data cannot be an input to a feed-forward neural network."
        ],
        "ans": [
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about SMILES are true?",
        "opts": [
          "SMILES is not the only form of representing a molecule.",
          "A molecule can have different SMILES representations.",
          "3D structure cannot be fully represented using SMILES.",
          "A molecular graph can be transformed into SMILES and vice versa."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about the concept of an optimal policy are true?",
        "opts": [
          "There can be multiple optimal policies.",
          "Applying the optimal policy essentially means to maximize the immediate reward.",
          "An optimal policy will minimize the cumulative reward.",
          "The optimal policy may be obtained via Q-learning."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about the many-to-many RNN type are true?",
        "opts": [
          "Given input Tx>1, output length Ty>1.",
          "Given input Tx>1, output length Ty=1.",
          "Given input Tx=1, output length Ty>1.",
          "Given input Tx=1, output length Ty=1."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which statements about the ReLU activation function are true?",
        "opts": [
          "For positive inputs, ReLU is equivalent to Leaky ReLU.",
          "For positive inputs, ReLU equates to the identity function.",
          "The derivative has a maximum value of 0.25.",
          "For negative inputs, the derivative is -1."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "Which statements about the vanishing gradient problem are true?",
        "opts": [
          "A vanishing gradient effectively means that the model does not learn.",
          "Repeated multiplication of gradients > 1 leads to a vanishing gradient.",
          "Repeated multiplication of gradients < 1 leads to a vanishing gradient.",
          "A vanishing gradient will be more likely when input values are not standardized."
        ],
        "ans": [
          0,
          2
        ],
        "multi": true
      },
      {
        "q": "Which statements about Self-Attention are true?",
        "opts": [
          "To compute Self-Attention, keys and queries are crucial components.",
          "The value vector in Self-Attention consists of parameters not optimized during training.",
          "Self-Attention can be computed in parallel.",
          "Self-Attention allows a Transformer to learn contextual information."
        ],
        "ans": [
          0,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements about word embeddings (word2vec) are true?",
        "opts": [
          "A major advantage of word2vec is that no large text corpora are necessary.",
          "Similar words should be mapped to similar regions in feature space.",
          "Skip gram predicts one target word given surrounding context words.",
          "Similarity of word embeddings can be measured with cosine similarity."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements are true about neural networks in general?",
        "opts": [
          "In principle, we can stack an arbitrary number of hidden layers.",
          "Weights and biases will perform a linear transformation of the input data.",
          "Activation functions are necessary to introduce non-linearity.",
          "In feed-forward NNs, the output layer should contain more nodes than the input layer."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Why is it a good idea to have a separate test set in addition to a training set?",
        "opts": [
          "Empirical risk minimization can be performed on two data sets.",
          "It allows to get a better estimate of the generalization error.",
          "It can be used to tune hyperparameters.",
          "It can be used to further optimize the model parameters."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Deep networks and vanishing gradients — which are true?",
        "opts": [
          "The deeper the network, the more multiplications in the forward pass.",
          "Deep networks will always suffer from the vanishing gradient problem.",
          "The vanishing gradient problem will typically occur towards the input layer.",
          "The chain rule reduces the effect of the vanishing gradient."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "y = σ'(-400) × σ'(300). Which are correct?",
        "opts": [
          "y cannot be computed in this case.",
          "y is a positive value.",
          "y is a negative value.",
          "y is close to 0."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      }
    ]
  },
  {
    "id": "ss2023",
    "title": "ML Exam — JKU June 2023",
    "description": "Bayesian classification, version control, early stopping, PyTorch submodules",
    "questions": [
      {
        "q": "Consider the following Dataset implementation: import numpy as np from torch.utils.data import Dataset class MyDataset(Dataset): def __init__(self, seed): self.rng = np.random.default_rng(seed) def __getitem__(self, index): return self.rng.uniform(size=(5,)) Which of the following statements are true?",
        "opts": [
          "An instance of this class would produce infinitely many samples.",
          "In a multi-processed data loading setting, the returned samples might not be reproducible because the seed of the",
          "The implementation is incorrect since the __getitem__ method should return a PyTorch tensor and not a NumPy array.",
          "The __len__ method should be implemented if it is intended to be used in combination with a default DataLoader"
        ],
        "ans": [
          0,
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "setting, the returned samples might not be reproducible because the seed of the random number generator is set only in the __init__ method., The __len__ method should be implemented if it is intended to be used in combination with a default DataLoader (with default Sampler). Which of the following are benefits of a version control system (VCS) such as git?",
        "opts": [
          "Efficient tracking of files and their changes.",
          "Automatic integration of unit tests.",
          "Access to previous versions.",
          "Useful for collaboration."
        ],
        "ans": [
          0,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "The correct answer is: Determine the constant for normalization on the training data and apply it also to the validation and test data. Assume you have the following binary confusion matrix: Predicted positive negative ------------------------------------ Actual positive | 30 0 | negative | 5 10 | ------------------------------------ Which of the following statements are correct?",
        "opts": [
          "The total number of samples is 45.",
          "The used model is more likely to predict the negative class.",
          "The classification performance is perfect.",
          "There are 30 true positives."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Assume you apply the following PyTorch image transformation to some example RGB image: transforms.Compose([ transforms.Grayscale(), transforms.RandomHorizontalFlip(0.5), transforms.RandomVerticalFlip(0.5), transforms.ToTensor() ]) Which of the following statements are correct?",
        "opts": [
          "The resulting image might be both horizontally and vertically flipped.",
          "The resulting image might not be flipped at all (neither horizontally nor vertically).",
          "The resulting image will be a PyTorch tensor.",
          "The resulting image might be vertically flipped.",
          "The resulting image will be in grayscale.",
          "The resulting image might be horizontally flipped."
        ],
        "ans": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "multi": true
      },
      {
        "q": "2. Compute gradients loss.backward() 3. Reset gradients optimizer.zero_grad() 4. Update weights optimizer.step() The correct answer is: 1. Compute loss 2. Compute gradients loss.backward() 3. Update weights optimizer.step() 4. Reset gradients optimizer.zero_grad() Which of the following statements are true regarding early stopping?",
        "opts": [
          "The stopping can be achieved by some heuristic (e.g., no validation loss improvement for a defined number of",
          "Using some validation set, early stopping can be applied to cancel/stop the training early.",
          "Early stopping is done automatically if the training loss reaches 0.",
          "Early stopping guarantees to return the best possible model, i.e., no better model could have been found if the training"
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are true regarding minibatch learning?",
        "opts": [
          "The batch size is a hyperparameter.",
          "Minibatch learning can potentially benefit from broadcast computations.",
          "The bigger the batch size, the better the learning (in terms of predictive model performance).",
          "The samples within a minibatch are used for one update step."
        ],
        "ans": [
          0,
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "The correct answer is: color jittering When creating minibatches and trying to stack input arrays in PyTorch (using torch.utils.data.DataLoader), it can happen that not all arrays of a batch are of the same shape. Which of the following statements are correct?",
        "opts": [
          "Stacking can be skipped and the arrays can just be kept in a list.",
          "A DataLoader cannot actually be used in this case.",
          "Arrays of unequal shape must be dropped/excluded.",
          "Padding can be applied to equalize all array shapes."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "The correct answer is: The attribute linear_list is a plain Python list and will thus be ignored by the automatic parameter registration. Which statements regarding PyTorch's parameter registration of a torch.nn.Module are true?",
        "opts": [
          "When assigned as attribute, a torch.nn.Parameter will automatically be registered.",
          "A torch.nn.Module must always contain at least one (trainable) parameter.",
          "When assigned as attribute, a torch.nn.Module (or submodule) will automatically be registered.",
          "Parameters and modules can be registered manually."
        ],
        "ans": [
          0,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "The correct answer is: It means that the model is able to compute outputs that are close to the true target. Consider a binary classification task where you want to classify sensors into either working (negative class) or faulty (positive class). There are roughly equally many working as faulty sensors. Which of the following evaluation metrics are appropriate for measuring the model performance?",
        "opts": [
          "accuracy (ACC)",
          "mean-squared error (MSE)",
          "mean absolute error (MAE)",
          "true positive rate (TPR)"
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Which of the following are commonly used loss functions?",
        "opts": [
          "rectified linear unit (ReLU)",
          "sigmoid",
          "mean-squared error",
          "cross entropy"
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are correct regarding the following hash function: def my_hash(x): return 304",
        "opts": [
          "The hash value is the same in different Python interpreter sessions.",
          "Up to 304 hash collisions can occur for unequal inputs.",
          "The hash function will work on any input.",
          "The computation of the hash value is fast."
        ],
        "ans": [
          0,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "The correct answer is: categorical data Which of the following statements are correct regarding a class that derives from torch.nn.Module?",
        "opts": [
          "The class must not contain other Modules.",
          "The __getitem__ method returns the training samples.",
          "The forward method specifies how an input is transformed into an output (the \"flow\" through the architecture).",
          "The __init__ method sets up the model architecture."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "architecture)., The __init__ method sets up the model architecture. Which of the following are typical data normalization/scaling approaches?",
        "opts": [
          "Scaling to range [1, 2].",
          "Scaling to range [-1, 1].",
          "Scaling to range [0, 1].",
          "Scaling to zero (0) mean and unit (1) variance."
        ],
        "ans": [
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are correct regarding monitoring a model during training?",
        "opts": [
          "Monitoring might decrease the model performance.",
          "Monitoring might aid in determining over- or underfitting.",
          "Monitoring might lead to higher computational run times.",
          "Monitoring might help in finding issues during training."
        ],
        "ans": [
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "The correct answer is: ...perform one weight update. Which of the following data augmentation techniques can be applied to image data?",
        "opts": [
          "dropping out pixels",
          "rotating",
          "adding noise",
          "zooming and/or cropping",
          "color jittering",
          "flipping horizontally"
        ],
        "ans": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are true regarding data augmentation?",
        "opts": [
          "Modifications in data augmentation can often be applied on-the-fly.",
          "Data augmentation is about creating \"new\" artificial samples by modifying existing samples.",
          "Modifications in data augmentation heavily depend on the data and task.",
          "Data augmentation always improves the model performance."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are correct when talking about normalization/scaling?",
        "opts": [
          "Normalization/scaling can depend on the method/model.",
          "Normalization/scaling can depend on the data.",
          "Normalization/scaling only makes sense for image data.",
          "Normalization/scaling is always beneficial."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "method/model. Which of the following statements are true regarding loss functions in the area of supervised learning?",
        "opts": [
          "Depending on the task (e.g., regression vs. classification), different loss functions might be appropriate.",
          "A loss function measures the distance between the model prediction and the true target value.",
          "Typically, for a given loss function, the lower the loss, the better the prediction.",
          "Comparing the values of different loss functions (e.g., mean-squared error vs. cross entropy) is usually not meaningful."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      }
    ]
  },
  {
    "id": "mlpc_ss20",
    "title": "MLPC Exam — JKU SS2020",
    "description": "JKU Machine Learning and Pattern Classification exam, Summer Semester 2020. Covers Bayesian classification, k-NN, decision trees, classifier evaluation, neural networks, and deep learning.",
    "questions": [
      {
        "context": "Bayesian Classification. Consider Bayes' Rule for classification: \\(P(\\omega_i \\mid \\mathbf{x}) = \\frac{p(\\mathbf{x} \\mid \\omega_i)P(\\omega_i)}{p(\\mathbf{x})} \\propto p(\\mathbf{x} \\mid \\omega_i)P(\\omega_i)\\). Consider a binary classification task over a set of classes \\(\\Omega = \\{\\omega_1, \\omega_2\\}\\), and answer each of the following questions in one sentence.",
        "q": "Why can we say that \\(p(\\mathbf{x})\\) is irrelevant for determining the MAP class?",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Open-ended. \\(p(\\mathbf{x})\\) is the same for all classes, so it does not affect which class maximises the posterior."
      },
      {
        "context": "Bayesian Classification. Consider Bayes' Rule for classification: \\(P(\\omega_i \\mid \\mathbf{x}) = \\frac{p(\\mathbf{x} \\mid \\omega_i)P(\\omega_i)}{p(\\mathbf{x})} \\propto p(\\mathbf{x} \\mid \\omega_i)P(\\omega_i)\\). Consider a binary classification task over a set of classes \\(\\Omega = \\{\\omega_1, \\omega_2\\}\\), and answer each of the following questions in one sentence.",
        "q": "What will happen if the prior \\(P(\\Omega)\\) is very uneven (i.e., with a high value for some class, and a low one for other)?",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Open-ended. The classifier will be biased toward predicting the high-prior class, even when the likelihoods are similar."
      },
      {
        "context": "Bayesian Classification. Consider Bayes' Rule for classification: \\(P(\\omega_i \\mid \\mathbf{x}) = \\frac{p(\\mathbf{x} \\mid \\omega_i)P(\\omega_i)}{p(\\mathbf{x})} \\propto p(\\mathbf{x} \\mid \\omega_i)P(\\omega_i)\\). Consider a binary classification task over a set of classes \\(\\Omega = \\{\\omega_1, \\omega_2\\}\\), and answer each of the following questions in one sentence.",
        "q": "Assume one particular class (say, \\(\\omega_1\\)) is so critical that we want a classifier that is guaranteed to classify all instances of class \\(\\omega_1\\) as \\(\\omega_1\\), and does not miss a single one. How can we obtain such a classifier?",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Open-ended. Use a cost matrix that assigns infinite (or very high) cost to misclassifying \\(\\omega_1\\) as \\(\\omega_2\\); equivalently, always predict \\(\\omega_1\\) whenever \\(p(\\mathbf{x}\\mid\\omega_1)P(\\omega_1) > 0\\)."
      },
      {
        "context": "Consider the following two loss functions (cost matrices) (where \\(\\lambda_{ij}\\) is the cost of predicting class \\(i\\) if the true class is \\(j\\)): $$\\lambda_1 = \\begin{pmatrix}0 & 1\\\\ 1 & 0\\end{pmatrix} \\qquad \\lambda_2 = \\begin{pmatrix}0 & 10\\\\ 10 & 0\\end{pmatrix}$$",
        "q": "Do they lead to different values of the Bayes risk?",
        "opts": [
          "yes",
          "no"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Consider the following two loss functions (cost matrices) (where \\(\\lambda_{ij}\\) is the cost of predicting class \\(i\\) if the true class is \\(j\\)): $$\\lambda_1 = \\begin{pmatrix}0 & 1\\\\ 1 & 0\\end{pmatrix} \\qquad \\lambda_2 = \\begin{pmatrix}0 & 10\\\\ 10 & 0\\end{pmatrix}$$",
        "q": "Do they lead a Bayesian classifier to make different predictions?",
        "opts": [
          "yes",
          "no"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "The k-Nearest-Neighbor Classifier. Which of the following statements is true (assume a numeric feature space, and Euclidean distance as our distance measure):",
        "q": "For \\(k = 1\\), the k-NN classifier cannot overfit the training data.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "The k-Nearest-Neighbor Classifier. Which of the following statements is true (assume a numeric feature space, and Euclidean distance as our distance measure):",
        "q": "Increasing \\(k\\) will increase the danger of overfitting.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "The k-Nearest-Neighbor Classifier. Which of the following statements is true (assume a numeric feature space, and Euclidean distance as our distance measure):",
        "q": "Setting \\(k\\) to a high value will lower the bias of the classifier.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "The k-Nearest-Neighbor Classifier. Which of the following statements is true (assume a numeric feature space, and Euclidean distance as our distance measure):",
        "q": "If we add additional redundant features to the data (e.g., identical copies of some feature), the predictions of the k-NN classifier can change.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "The k-Nearest-Neighbor Classifier. Which of the following statements is true (assume a numeric feature space, and Euclidean distance as our distance measure):",
        "q": "If we change the scale of one of the features (e.g., by multiplying all values by 1000), the predictions of the k-NN classifier can change.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Decision Tree Learning. Consider the following simple one-dimensional (i.e., one numeric feature X only) training set in a two-class classification task. Along the X axis the labels appear in this order: `+ + - + + + - + - - -`.",
        "q": "What is the minimum depth of a decision tree with binary splits on X that has an error of 0 on this dataset? (The depth of a tree that only consists of 1 node (the root) is 0; the depth of an arbitrary tree is the length of its longest branch).",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "The correct answer is: 3"
      },
      {
        "q": "Why can the same numeric feature be used several times along some path in a decision tree, but a symbolic feature can not?",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Open-ended. A numeric split partitions the range (e.g., X<a), so further splits on subranges still provide information; a symbolic feature is fully determined by a single split on its discrete value, so reusing it provides no new information."
      },
      {
        "context": "Consider the following stop criterion for ID3: \"If a node contains \\(\\leq k\\) examples, do not further split it; turn it into a leaf that predicts the majority class in these \\(\\leq k\\) examples.\"",
        "q": "Can this help against overfitting?",
        "opts": [
          "Yes",
          "No"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Consider the following stop criterion for ID3: \"If a node contains \\(\\leq k\\) examples, do not further split it; turn it into a leaf that predicts the majority class in these \\(\\leq k\\) examples.\" If we make \\(k\\) larger for this stop criterion, which of the following statements are true:",
        "q": "... the error on the training data cannot go down",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Consider the following stop criterion for ID3: \"If a node contains \\(\\leq k\\) examples, do not further split it; turn it into a leaf that predicts the majority class in these \\(\\leq k\\) examples.\" If we make \\(k\\) larger for this stop criterion, which of the following statements are true:",
        "q": "... the error on independent test data cannot go up",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Consider the following stop criterion for ID3: \"If a node contains \\(\\leq k\\) examples, do not further split it; turn it into a leaf that predicts the majority class in these \\(\\leq k\\) examples.\" If we make \\(k\\) larger for this stop criterion, which of the following statements are true:",
        "q": "... the error on independent test data cannot go down",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Classifier Evaluation. Consider a binary classification task over a set of classes \\(\\Omega = \\{\\omega_1, \\omega_2\\}\\). Which of the following statements on precision and recall are true?",
        "q": "A classifier cannot have both Recall = 1.0 and Precision = 1.0 on class \\(\\omega_1\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Classifier Evaluation. Consider a binary classification task over a set of classes \\(\\Omega = \\{\\omega_1, \\omega_2\\}\\). Which of the following statements on precision and recall are true?",
        "q": "A classifier cannot have both Recall = 1.0 and Precision = 0.0 on class \\(\\omega_1\\).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Classifier Evaluation. Consider a binary classification task over a set of classes \\(\\Omega = \\{\\omega_1, \\omega_2\\}\\). Which of the following statements on precision and recall are true?",
        "q": "If, on a specific dataset, a classifier A has a higher recall on class \\(\\omega_1\\) than another classifier B, then A must have lower precision on \\(\\omega_1\\) than B",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Which of the following statements on ROC analysis are true?",
        "q": "No line segment of the ROC convex hull can be strictly horizontal.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Which of the following statements on ROC analysis are true?",
        "q": "Classifiers in different places on the ROC convex hull can have the same classification accuracy.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Which of the following statements on ROC analysis are true?",
        "q": "If two classifiers C1 and C2 have the same accuracy, then the difference between their TPRs \\((TPR_1 - TPR_2)\\) must be exactly compensated by a corresponding difference in FPR: \\((TPR_1 - TPR_2) = (FPR_1 - FPR_2)\\).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "If we multiply every entry in the cost matrix by 2.0, ...",
        "opts": [
          "... the optimal classifier will stay where it is",
          "... the optimal classifier will move",
          "... the optimal classifier becomes undefined"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Would you rather be in ROC heaven or in ROC hell?",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Open-ended. ROC heaven (TPR=1, FPR=0) is the ideal classifier; ROC hell (TPR=0, FPR=1) is the worst, but it can be inverted into a perfect classifier — so either is informative, but heaven is preferable."
      },
      {
        "context": "Neural Networks. Consider the following three possible loss functions for a regression problem, where \\(y_i\\) is the true target value for input example \\(x_i\\) and \\(\\hat{y}(x_i)\\) is the value predicted by the model from input \\(x_i\\): $$L_1 = \\sqrt{\\frac{1}{|\\mathcal{D}|}\\sum_{x_i\\in\\mathcal{D}}(y_i - \\hat{y}(x_i))^2}$$ $$L_2 = \\sum_{x_i\\in\\mathcal{D}}(y_i - \\hat{y}(x_i))$$ $$L_3 = \\max_{x_i\\in\\mathcal{D}}(y_i - \\hat{y}(x_i))^2$$ Which of these would be meaningful loss functions for a regression problem (and for a feed-forward neural network)?",
        "q": "\\(L_1\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Neural Networks. Consider the following three possible loss functions for a regression problem, where \\(y_i\\) is the true target value for input example \\(x_i\\) and \\(\\hat{y}(x_i)\\) is the value predicted by the model from input \\(x_i\\): $$L_1 = \\sqrt{\\frac{1}{|\\mathcal{D}|}\\sum_{x_i\\in\\mathcal{D}}(y_i - \\hat{y}(x_i))^2}$$ $$L_2 = \\sum_{x_i\\in\\mathcal{D}}(y_i - \\hat{y}(x_i))$$ $$L_3 = \\max_{x_i\\in\\mathcal{D}}(y_i - \\hat{y}(x_i))^2$$ Which of these would be meaningful loss functions for a regression problem (and for a feed-forward neural network)?",
        "q": "\\(L_2\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Neural Networks. Consider the following three possible loss functions for a regression problem, where \\(y_i\\) is the true target value for input example \\(x_i\\) and \\(\\hat{y}(x_i)\\) is the value predicted by the model from input \\(x_i\\): $$L_1 = \\sqrt{\\frac{1}{|\\mathcal{D}|}\\sum_{x_i\\in\\mathcal{D}}(y_i - \\hat{y}(x_i))^2}$$ $$L_2 = \\sum_{x_i\\in\\mathcal{D}}(y_i - \\hat{y}(x_i))$$ $$L_3 = \\max_{x_i\\in\\mathcal{D}}(y_i - \\hat{y}(x_i))^2$$ Which of these would be meaningful loss functions for a regression problem (and for a feed-forward neural network)?",
        "q": "\\(L_3\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which of these three loss functions could be problematic for the backpropagation algorithm, and why? Answer in one sentence!",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Open-ended. \\(L_3\\) (the max) is problematic because gradients flow only through the single worst example each step, giving very sparse / unstable updates."
      },
      {
        "q": "When you add an additional hidden layer to a feed-forward network, how does that affect the bias of the network model?",
        "opts": [
          "it decreases",
          "it increases",
          "it stays the same"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "And how does add an additional hidden layer affect the variance of the network model?",
        "opts": [
          "it decreases",
          "it increases",
          "it stays the same"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Deep Learning. Which of the following statements are true:",
        "q": "Deep learning researches the simulation of biological neurons with computers.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Deep Learning. Which of the following statements are true:",
        "q": "Artificial neural networks are mappings from tensors (vectors, matrices, or higher-order tensors) to other tensors.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Deep Learning. Which of the following statements are true:",
        "q": "The majority of parameters in a deep neural network is specified by hand.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "In the two-player game \"Connect Four\", players take turns inserting a chip of their player color (which is either red or yellow) into one of the board's seven slots, where it falls down to occupy the bottom-most free window. The game ends if one of the players manages to fill four connected windows (horizontally, vertically or diagonally) with their own color, or if the board is full. (The page shows a photo of a standard yellow Connect Four board with red and yellow chips already inserted.) You want to train a deep neural network to play the yellow player, by teaching it to look at the current board state (= network input) and suggest a move (= network output).",
        "q": "How would you represent the board state for the neural network?",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Open-ended. A common answer: a 6x7x2 tensor (one channel per player) with one-hot indicators marking occupied cells; alternatively a 6x7 integer matrix with values {-1, 0, +1}."
      },
      {
        "context": "In the two-player game \"Connect Four\", players take turns inserting a chip of their player color (which is either red or yellow) into one of the board's seven slots, where it falls down to occupy the bottom-most free window. The game ends if one of the players manages to fill four connected windows (horizontally, vertically or diagonally) with their own color, or if the board is full. You want to train a deep neural network to play the yellow player, by teaching it to look at the current board state (= network input) and suggest a move (= network output).",
        "q": "How would you represent the expected output of the neural network?",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Open-ended. A 7-dimensional softmax output, one probability per column, indicating in which column to drop the next chip."
      },
      {
        "context": "In the two-player game \"Connect Four\", players take turns inserting a chip of their player color (which is either red or yellow) into one of the board's seven slots, where it falls down to occupy the bottom-most free window. The game ends if one of the players manages to fill four connected windows (horizontally, vertically or diagonally) with their own color, or if the board is full. You want to train a deep neural network to play the yellow player, by teaching it to look at the current board state (= network input) and suggest a move (= network output).",
        "q": "You are training it on recorded games of \"Connect Four\" experts. What is a possible data augmentation method you can use to derive additional training examples from the recordings? (Note that data augmentation is allowed to modify the targets.)",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Open-ended. Mirror the board horizontally (and mirror the chosen column accordingly), since Connect Four is symmetric under left-right reflection."
      },
      {
        "context": "In the two-player game \"Connect Four\", players take turns inserting a chip of their player color (which is either red or yellow) into one of the board's seven slots, where it falls down to occupy the bottom-most free window. The game ends if one of the players manages to fill four connected windows (horizontally, vertically or diagonally) with their own color, or if the board is full. You want to train a deep neural network to play the yellow player, by teaching it to look at the current board state (= network input) and suggest a move (= network output).",
        "q": "Would you recommend only fully-connected (= dense) layers or also include convolutional layers for this task?",
        "opts": [
          "Only fully-connected (dense) layers",
          "Include convolutional layers"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "What was the worst / most difficult part of the ML group project?",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Open-ended feedback question."
      },
      {
        "q": "Was there anything you liked about it?",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Open-ended feedback question."
      },
      {
        "q": "I hereby declare that I did work on the exam independently and only the permitted aids were used, and, in particular, that no communication took place with a third party at any time during the examination.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      }
    ]
  },
  {
    "id": "mlpc_ss22",
    "title": "MLPC Exam — JKU SS2022",
    "description": "Machine Learning and Pattern Classification final exam",
    "questions": [
      {
        "context": "1. Bayesian Classification\n\nConsider the following decision strategies for classifying an object (feature vector) \\(\\mathbf{x}\\) in a two-class problem with classes \\(\\omega_1, \\omega_2\\):\n- S1. Predict \\(\\omega_1\\) iff \\(P(\\omega_1) > P(\\omega_2)\\)\n- S2. Predict \\(\\omega_1\\) iff \\(p(\\mathbf{x} \\mid \\omega_1) > p(\\mathbf{x} \\mid \\omega_2)\\)\n- S3. Predict \\(\\omega_1\\) iff \\(P(\\omega_1 \\mid \\mathbf{x}) > P(\\omega_2 \\mid \\mathbf{x})\\)\n- S4. Predict \\(\\omega_1\\) iff \\(P(\\omega_1) > 0.5\\)\n- S5. Predict \\(\\omega_1\\) iff \\(p(\\mathbf{x} \\mid \\omega_1) > p(\\mathbf{x})\\)\n- S6. Predict \\(\\omega_1\\) iff \\(P(\\omega_1 \\mid \\mathbf{x}) > P(\\omega_1)\\)\n\nand assume that we know the true values of the various probabilities appearing above.",
        "q": "Which of these strategies result in the baseline accuracy?",
        "opts": [
          "S1",
          "S2",
          "S3",
          "S4",
          "S5",
          "S6"
        ],
        "ans": [
          0,
          3
        ],
        "multi": true,
        "explanation": "S1 and S4 only use priors \\(P(\\omega_i)\\), so they always predict the majority class, giving baseline accuracy."
      },
      {
        "context": "1. Bayesian Classification\n\nConsider the following decision strategies for classifying an object (feature vector) \\(\\mathbf{x}\\) in a two-class problem with classes \\(\\omega_1, \\omega_2\\):\n- S1. Predict \\(\\omega_1\\) iff \\(P(\\omega_1) > P(\\omega_2)\\)\n- S2. Predict \\(\\omega_1\\) iff \\(p(\\mathbf{x} \\mid \\omega_1) > p(\\mathbf{x} \\mid \\omega_2)\\)\n- S3. Predict \\(\\omega_1\\) iff \\(P(\\omega_1 \\mid \\mathbf{x}) > P(\\omega_2 \\mid \\mathbf{x})\\)\n- S4. Predict \\(\\omega_1\\) iff \\(P(\\omega_1) > 0.5\\)\n- S5. Predict \\(\\omega_1\\) iff \\(p(\\mathbf{x} \\mid \\omega_1) > p(\\mathbf{x})\\)\n- S6. Predict \\(\\omega_1\\) iff \\(P(\\omega_1 \\mid \\mathbf{x}) > P(\\omega_1)\\)\n\nand assume that we know the true values of the various probabilities appearing above.",
        "q": "Which of these strategies are guaranteed to have the Bayes Error?",
        "opts": [
          "S1",
          "S2",
          "S3",
          "S4",
          "S5",
          "S6"
        ],
        "ans": [
          2
        ],
        "multi": true,
        "explanation": "S3 uses the posterior \\(P(\\omega_i \\mid \\mathbf{x})\\), which is the Bayes-optimal decision rule."
      },
      {
        "context": "1. Bayesian Classification\n\nConsider the following decision strategies for classifying an object (feature vector) \\(\\mathbf{x}\\) in a two-class problem with classes \\(\\omega_1, \\omega_2\\):\n- S1. Predict \\(\\omega_1\\) iff \\(P(\\omega_1) > P(\\omega_2)\\)\n- S2. Predict \\(\\omega_1\\) iff \\(p(\\mathbf{x} \\mid \\omega_1) > p(\\mathbf{x} \\mid \\omega_2)\\)\n- S3. Predict \\(\\omega_1\\) iff \\(P(\\omega_1 \\mid \\mathbf{x}) > P(\\omega_2 \\mid \\mathbf{x})\\)\n- S4. Predict \\(\\omega_1\\) iff \\(P(\\omega_1) > 0.5\\)\n- S5. Predict \\(\\omega_1\\) iff \\(p(\\mathbf{x} \\mid \\omega_1) > p(\\mathbf{x})\\)\n- S6. Predict \\(\\omega_1\\) iff \\(P(\\omega_1 \\mid \\mathbf{x}) > P(\\omega_1)\\)\n\nand assume that we know the true values of the various probabilities appearing above.",
        "q": "Which of these strategies take into account both prior and likelihood?",
        "opts": [
          "S1",
          "S2",
          "S3",
          "S4",
          "S5",
          "S6"
        ],
        "ans": [
          2,
          5
        ],
        "multi": true,
        "explanation": "S3 and S6 use the posterior, which by Bayes' rule combines both prior and likelihood."
      },
      {
        "context": "1. Bayesian Classification — Under which conditions will S2 and S3 make identical predictions?\n\n(S2: predict \\(\\omega_1\\) iff \\(p(\\mathbf{x} \\mid \\omega_1) > p(\\mathbf{x} \\mid \\omega_2)\\); S3: predict \\(\\omega_1\\) iff \\(P(\\omega_1 \\mid \\mathbf{x}) > P(\\omega_2 \\mid \\mathbf{x})\\).)",
        "q": "\\(P(\\omega_1) = 0\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "If \\(P(\\omega_1)=0\\), S3 always predicts \\(\\omega_2\\), but S2 still depends on likelihoods, so they don't always agree."
      },
      {
        "context": "1. Bayesian Classification — Under which conditions will S2 and S3 make identical predictions?\n\n(S2: predict \\(\\omega_1\\) iff \\(p(\\mathbf{x} \\mid \\omega_1) > p(\\mathbf{x} \\mid \\omega_2)\\); S3: predict \\(\\omega_1\\) iff \\(P(\\omega_1 \\mid \\mathbf{x}) > P(\\omega_2 \\mid \\mathbf{x})\\).)",
        "q": "\\(P(\\omega_1) = P(\\omega_2)\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Equal priors cancel in Bayes' rule, so comparing posteriors reduces to comparing likelihoods."
      },
      {
        "context": "1. Bayesian Classification — Under which conditions will S2 and S3 make identical predictions?\n\n(S2: predict \\(\\omega_1\\) iff \\(p(\\mathbf{x} \\mid \\omega_1) > p(\\mathbf{x} \\mid \\omega_2)\\); S3: predict \\(\\omega_1\\) iff \\(P(\\omega_1 \\mid \\mathbf{x}) > P(\\omega_2 \\mid \\mathbf{x})\\).)",
        "q": "\\(p(\\mathbf{x} \\mid \\omega_1) = p(\\mathbf{x} \\mid \\omega_2)\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "If likelihoods are equal, S2 is undecided/tied, but S3 depends on priors and would pick the higher-prior class."
      },
      {
        "context": "1. Bayesian Classification — Under which conditions will S2 and S3 make identical predictions?\n\n(S2: predict \\(\\omega_1\\) iff \\(p(\\mathbf{x} \\mid \\omega_1) > p(\\mathbf{x} \\mid \\omega_2)\\); S3: predict \\(\\omega_1\\) iff \\(P(\\omega_1 \\mid \\mathbf{x}) > P(\\omega_2 \\mid \\mathbf{x})\\).)",
        "q": "\\(P(\\omega_1) = 1\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "S3 always predicts \\(\\omega_1\\) regardless of \\(\\mathbf{x}\\), but S2 still depends on likelihoods."
      },
      {
        "context": "1. Bayesian Classification — Which of the following statements are true?",
        "q": "If the two classes are equally frequent (\\(P(\\omega_1) = P(\\omega_2)\\)), then S2 and S3 are equivalent.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "With equal priors, the posterior comparison reduces to the likelihood comparison."
      },
      {
        "context": "1. Bayesian Classification — Which of the following statements are true?",
        "q": "If \\(P(\\omega_1 \\mid \\mathbf{x}) > P(\\omega_1)\\), then \\(P(\\omega_2 \\mid \\mathbf{x}) < P(\\omega_2)\\).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Since \\(P(\\omega_1 \\mid \\mathbf{x}) + P(\\omega_2 \\mid \\mathbf{x}) = 1\\) and \\(P(\\omega_1) + P(\\omega_2) = 1\\), an increase on one side forces a decrease on the other."
      },
      {
        "context": "1. Bayesian Classification — Which of the following statements are true?",
        "q": "If \\(p(\\mathbf{x} \\mid \\omega_1) > p(\\mathbf{x})\\), then \\(p(\\mathbf{x} \\mid \\omega_2) < p(\\mathbf{x})\\).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "\\(p(\\mathbf{x}) = P(\\omega_1) p(\\mathbf{x} \\mid \\omega_1) + P(\\omega_2) p(\\mathbf{x} \\mid \\omega_2)\\) is a convex combination, so if one likelihood is above the mixture the other must be below."
      },
      {
        "context": "2. Classifier Evaluation (a)\n\nConsider an arbitrary classifier X for a binary classification problem, with unknown classification behavior. If this classifier were evaluated on a test set T consisting only of positive examples (i.e., if the test examples all belong to the positive class), which of the following statements would be correct, and which would be wrong:\n\nThe accuracy of X, as measured on T, can be expected to be ...",
        "q": "... equal to the baseline accuracy (on T).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Baseline accuracy on T (all positives) is 1.0 (always-positive baseline), while X's accuracy is unknown."
      },
      {
        "context": "2. Classifier Evaluation (a)\n\nConsider an arbitrary classifier X for a binary classification problem, with unknown classification behavior. If this classifier were evaluated on a test set T consisting only of positive examples (i.e., if the test examples all belong to the positive class), which of the following statements would be correct, and which would be wrong:\n\nThe accuracy of X, as measured on T, can be expected to be ...",
        "q": "... 0.0",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "X may correctly classify some positives, so accuracy isn't necessarily 0."
      },
      {
        "context": "2. Classifier Evaluation (a)\n\nConsider an arbitrary classifier X for a binary classification problem, with unknown classification behavior. If this classifier were evaluated on a test set T consisting only of positive examples (i.e., if the test examples all belong to the positive class), which of the following statements would be correct, and which would be wrong:\n\nThe accuracy of X, as measured on T, can be expected to be ...",
        "q": "... equal to its recall (on T).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "When all examples are positive, accuracy = TP/(TP+FN) = recall."
      },
      {
        "context": "2. Classifier Evaluation (a)\n\nConsider an arbitrary classifier X for a binary classification problem, with unknown classification behavior. If this classifier were evaluated on a test set T consisting only of positive examples (i.e., if the test examples all belong to the positive class), which of the following statements would be correct, and which would be wrong:\n\nThe accuracy of X, as measured on T, can be expected to be ...",
        "q": "... equal to the accuracy (on T) of a classifier that always predicts the positive class.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "A classifier always predicting positive achieves accuracy 1.0 on T, but X's accuracy is unknown."
      },
      {
        "context": "2. Classifier Evaluation (a)\n\nConsider an arbitrary classifier X for a binary classification problem, with unknown classification behavior. If this classifier were evaluated on a test set T consisting only of positive examples (i.e., if the test examples all belong to the positive class), which of the following statements would be correct, and which would be wrong:\n\nThe accuracy of X, as measured on T, can be expected to be ...",
        "q": "... 1.0 (100%)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "X's accuracy is unknown; it need not be perfect."
      },
      {
        "context": "2. Classifier Evaluation (b)\n\nConsider a 2-class classification problem with classes p and n, and a 2D \"Recall-Precision (RP) Space\" (in analogy to ROC space), where the horizontal axis (\\(x\\)) is recall on class p, and the vertical axis (\\(y\\)) is precision on class p.\n\nWhich points in this RP space correspond to the following default classifiers:",
        "q": "All p classifier (a classifier that always predicts class p):",
        "opts": [
          "lower left corner",
          "upper left corner",
          "upper right corner",
          "lower right corner",
          "possibly some other point in the space",
          "one of the measures is undefined"
        ],
        "ans": [
          2,
          4
        ],
        "multi": true,
        "explanation": "Recall on p = 1 (all p are recovered). Precision = fraction of p in dataset, so it lies on \\(x=1\\) somewhere between 0 and 1 depending on prior."
      },
      {
        "context": "2. Classifier Evaluation (b)\n\nConsider a 2-class classification problem with classes p and n, and a 2D \"Recall-Precision (RP) Space\" (in analogy to ROC space), where the horizontal axis (\\(x\\)) is recall on class p, and the vertical axis (\\(y\\)) is precision on class p.\n\nWhich points in this RP space correspond to the following default classifiers:",
        "q": "All n classifier:",
        "opts": [
          "lower left corner",
          "upper left corner",
          "upper right corner",
          "lower right corner",
          "possibly some other point in the space",
          "one of the measures is undefined"
        ],
        "ans": [
          5
        ],
        "multi": false,
        "explanation": "No p predicted: precision = 0/0 is undefined."
      },
      {
        "context": "2. Classifier Evaluation (b)\n\nConsider a 2-class classification problem with classes p and n, and a 2D \"Recall-Precision (RP) Space\" (in analogy to ROC space), where the horizontal axis (\\(x\\)) is recall on class p, and the vertical axis (\\(y\\)) is precision on class p.\n\nWhich points in this RP space correspond to the following default classifiers:",
        "q": "Random 50:50 guessing classifier:",
        "opts": [
          "point \\((x=1.0; y=0.5)\\)",
          "point \\((x=0.5; y=1.0)\\)",
          "point \\((x=0.5; y=0.5)\\)",
          "possibly some other point in the space",
          "one of the measures is undefined"
        ],
        "ans": [
          2,
          3
        ],
        "multi": true,
        "explanation": "Recall = 0.5 (half of p caught). Precision = class prior of p, so it lies at \\(x=0.5\\) with \\(y =\\) prior."
      },
      {
        "context": "2. Classifier Evaluation (c)\n\nWhich of the following statements are true, and which are false (always relative to some fixed dataset D)?",
        "q": "A classifier that predicts between the two classes randomly will have Recall = Precision = 0.5.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Recall would be 0.5, but precision equals the prior of the positive class, not necessarily 0.5."
      },
      {
        "context": "2. Classifier Evaluation (c)\n\nWhich of the following statements are true, and which are false (always relative to some fixed dataset D)?",
        "q": "Two classifiers with the same recall and same precision can have different accuracy.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Given a fixed dataset, the same recall and precision determine TP, FP, FN, and hence TN and accuracy."
      },
      {
        "context": "2. Classifier Evaluation (c)\n\nWhich of the following statements are true, and which are false (always relative to some fixed dataset D)?",
        "q": "If a classifier A has higher recall than B on a dataset D, it must have lower precision than B.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "There is no strict tradeoff; both can improve simultaneously."
      },
      {
        "context": "3. Classifiers\n\nAssume a binary classification task with classes \\(\\Omega = \\{salmon, bass\\}\\) and two (heavily discretized) features \\(x_1\\) (Length) and \\(x_2\\) (Lightness).\n\nAlso assume we have a training set \\(\\mathcal{D}\\) consisting of four fish only:\n- [short, dark], salmon\n- [short, light], salmon\n- [long, dark], bass\n- [long, light], bass\n\n3. Classifiers (a)",
        "q": "Calculate the empirical entropy (log base 2) of the class distribution in \\(\\mathcal{D}\\) (no calculator needed).",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Two salmon, two bass; entropy \\(= -2 \\cdot 0.5 \\log_2 0.5 = 1\\)."
      },
      {
        "context": "3. Classifiers\n\nAssume a binary classification task with classes \\(\\Omega = \\{salmon, bass\\}\\) and two (heavily discretized) features \\(x_1\\) (Length) and \\(x_2\\) (Lightness).\n\nAlso assume we have a training set \\(\\mathcal{D}\\) consisting of four fish only:\n- [short, dark], salmon\n- [short, light], salmon\n- [long, dark], bass\n- [long, light], bass\n\n3. Classifiers (a)",
        "q": "Calculate the information gains of the two features Length and Lightness on \\(\\mathcal{D}\\) (no calculator needed). (Answer for Length.)",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Length splits perfectly (short→salmon, long→bass), so IG(Length) = 1. Lightness gives no information, IG(Lightness) = 0."
      },
      {
        "context": "3. Classifiers\n\nAssume a binary classification task with classes \\(\\Omega = \\{salmon, bass\\}\\) and two (heavily discretized) features \\(x_1\\) (Length) and \\(x_2\\) (Lightness).\n\nAlso assume we have a training set \\(\\mathcal{D}\\) consisting of four fish only:\n- [short, dark], salmon\n- [short, light], salmon\n- [long, dark], bass\n- [long, light], bass\n\n3. Classifiers (a)",
        "q": "What is the depth of the simplest decision tree consistent with this dataset? (The depth of a tree that only consists of 1 node (the root) is 0; the depth of an arbitrary tree is the length of its longest branch).",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "Splitting on Length alone gives pure leaves, so depth = 1."
      },
      {
        "context": "3. Classifiers\n\nAssume a binary classification task with classes \\(\\Omega = \\{salmon, bass\\}\\) and two (heavily discretized) features \\(x_1\\) (Length) and \\(x_2\\) (Lightness).\n\nAlso assume we have a training set \\(\\mathcal{D}\\) consisting of four fish only:\n- [short, dark], salmon\n- [short, light], salmon\n- [long, dark], bass\n- [long, light], bass\n\n3. Classifiers (a)",
        "q": "On this dataset, would the ID3 algorithm be guaranteed to find the simplest possible tree?",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "ID3 picks the feature with highest information gain (Length), producing the depth-1 optimal tree."
      },
      {
        "context": "3. Classifiers\n\nAssume a binary classification task with classes \\(\\Omega = \\{salmon, bass\\}\\) and two (heavily discretized) features \\(x_1\\) (Length) and \\(x_2\\) (Lightness).\n\nAlso assume we have a training set \\(\\mathcal{D}\\) consisting of four fish only:\n- [short, dark], salmon\n- [short, light], salmon\n- [long, dark], bass\n- [long, light], bass\n\n3. Classifiers (a)",
        "q": "Specify the probability distributions that Naive Bayes would use for classification, given this dataset for training. Fill in: \\(P(Class) = [salmon=?, bass=?]\\); \\(P(Length \\mid Class=salmon) = [short=?, long=?]\\); \\(P(Length \\mid Class=bass) = [short=?, long=?]\\); \\(P(Lightness \\mid Class=salmon) = [dark=?, light=?]\\); \\(P(Lightness \\mid Class=bass) = [dark=?, light=?]\\).",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "\\(P(Class) = [0.5, 0.5]\\); \\(P(Length \\mid salmon) = [1, 0]\\); \\(P(Length \\mid bass) = [0, 1]\\); \\(P(Lightness \\mid salmon) = [0.5, 0.5]\\); \\(P(Lightness \\mid bass) = [0.5, 0.5]\\)."
      },
      {
        "context": "3. Classifiers (a) — If we added 5 copies of the fourth example ([long, light]; bass) as additional training examples to \\(\\mathcal{D}\\), which of the following statements would be true?",
        "q": "The decision tree learned by ID3 would degenerate to a root node that predicts the majority class (bass).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Length still perfectly separates the classes (all salmon are short, all bass are long), so the tree retains the Length split."
      },
      {
        "context": "3. Classifiers (a) — If we added 5 copies of the fourth example ([long, light]; bass) as additional training examples to \\(\\mathcal{D}\\), which of the following statements would be true?",
        "q": "The bass examples from D would end up in the same leaf.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "All bass have Length = long, so they sit in the long-leaf together."
      },
      {
        "context": "3. Classifiers (a) — If we added 5 copies of the fourth example ([long, light]; bass) as additional training examples to \\(\\mathcal{D}\\), which of the following statements would be true?",
        "q": "The prior for Naive Bayes would change.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Adding bass examples shifts the empirical class frequencies."
      },
      {
        "context": "3. Classifiers (a) — If we added 5 copies of the fourth example ([long, light]; bass) as additional training examples to \\(\\mathcal{D}\\), which of the following statements would be true?",
        "q": "The decision tree learned by ID3 would get one level deeper.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Length still gives a perfect split; no extra depth needed."
      },
      {
        "context": "3. Classifiers (a) — If we added 5 copies of the fourth example ([long, light]; bass) as additional training examples to \\(\\mathcal{D}\\), which of the following statements would be true?",
        "q": "The decision tree learned by ID3 would stay exactly the same.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "ID3 still chooses Length and obtains pure leaves; tree is identical."
      },
      {
        "context": "3. Classifiers (b)\n\nNow suppose we encode the features and class labels in the above dataset as numbers (short = 0, long = 1; dark = 0, light = 1; salmon = 0, bass = 1).",
        "q": "Are the classes linearly separable?",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "The hyperplane \\(x_1 = 0.5\\) (i.e., Length) separates salmon from bass."
      },
      {
        "context": "3. Classifiers (b)\n\nNow suppose we encode the features and class labels in the above dataset as numbers (short = 0, long = 1; dark = 0, light = 1; salmon = 0, bass = 1).",
        "q": "How many units do we need to express a classifier (without hidden layer) that predicts \\(P(bass \\mid Features)\\) as a feed-forward neural network? (Don't forget the bias unit!)",
        "opts": [],
        "ans": [],
        "multi": false,
        "explanation": "2 input units + 1 bias unit + 1 output unit = 4."
      },
      {
        "context": "3. Classifiers (b)\n\nNow suppose we encode the features and class labels in the above dataset as numbers (short = 0, long = 1; dark = 0, light = 1; salmon = 0, bass = 1).",
        "q": "Which examples in \\(\\mathcal{D}\\) are exactly on the margin (i.e., are support vectors) in a maximum margin linear classifier?",
        "opts": [
          "([short, dark], salmon), ([short, light], salmon)",
          "([short, dark], salmon), ([long, light], bass)",
          "([short, dark], salmon)",
          "all four",
          "none of them",
          "a maximum margin linear classifier does not exist for this dataset"
        ],
        "ans": [
          3
        ],
        "multi": false,
        "explanation": "With the symmetric 4-point layout, all four points lie at equal distance from the optimal separating hyperplane."
      },
      {
        "context": "3. Classifiers (b) — If we added four (4) copies of the fourth example ([long, light]; bass) as additional training examples to \\(\\mathcal{D}\\), which of the following statements would be true?",
        "q": "The decision boundary for a k-NN classifier with \\(k=4\\) would look different than the boundary with \\(k=1\\).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "With duplicated bass examples, the k=4 neighborhood is dominated by bass in regions where k=1 would not be."
      },
      {
        "context": "3. Classifiers (b) — If we added four (4) copies of the fourth example ([long, light]; bass) as additional training examples to \\(\\mathcal{D}\\), which of the following statements would be true?",
        "q": "A feed-forward neural network for this dataset would require twice as many input units (not considering the bias unit).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "The input dimensionality depends on features, not the number of examples."
      },
      {
        "context": "3. Classifiers (b) — If we added four (4) copies of the fourth example ([long, light]; bass) as additional training examples to \\(\\mathcal{D}\\), which of the following statements would be true?",
        "q": "A k-NN classifier with \\(k=1\\) would change its prediction behaviour.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Duplicates at the same location don't change the 1-NN decision regions."
      },
      {
        "context": "3. Classifiers (b) — If we added four (4) copies of the fourth example ([long, light]; bass) as additional training examples to \\(\\mathcal{D}\\), which of the following statements would be true?",
        "q": "A k-NN classifier with \\(k=9\\) would always predict class bass.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "With 8 examples in total (4 original + 4 duplicates of bass), there are 5 bass and 3 salmon (wait: 2 salmon + 6 bass = 8) — bass dominate in any 9-neighborhood, but since |D|<9 all examples are neighbors, giving majority bass."
      },
      {
        "context": "4. Neural Networks and Deep Learning (a)\n\nConsider the following four possible loss functions for a regression problem, where\n- \\(y_i\\) ... true target value for example \\(\\mathbf{x}_i\\)\n- \\(\\hat{y}(\\mathbf{x}_i)\\) ... value predicted by model from input vector \\(\\mathbf{x}_i\\)\n\nWhich of these measures are not meaningful as error measures on a numeric regression task?",
        "q": "$$L_1 = \\frac{1}{|\\mathcal{D}|} \\sum_{\\mathbf{x}_i \\in \\mathcal{D}} (y_i - \\hat{y}(\\mathbf{x}_i))$$\n\nNot meaningful?",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Errors can cancel out (positive and negative), so this signed mean error is not a meaningful loss."
      },
      {
        "context": "4. Neural Networks and Deep Learning (a)\n\nConsider the following four possible loss functions for a regression problem, where\n- \\(y_i\\) ... true target value for example \\(\\mathbf{x}_i\\)\n- \\(\\hat{y}(\\mathbf{x}_i)\\) ... value predicted by model from input vector \\(\\mathbf{x}_i\\)\n\nWhich of these measures are not meaningful as error measures on a numeric regression task?",
        "q": "$$L_4 = \\frac{1}{|\\mathcal{D}|} \\sum_{\\mathbf{x}_i \\in \\mathcal{D}} e^{|y_i - \\hat{y}(\\mathbf{x}_i)|}$$\n\nNot meaningful?",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Exponential of absolute error is a valid (monotonic) loss, minimized at perfect prediction (value 1)."
      },
      {
        "context": "4. Neural Networks and Deep Learning (a)\n\nConsider the following four possible loss functions for a regression problem, where\n- \\(y_i\\) ... true target value for example \\(\\mathbf{x}_i\\)\n- \\(\\hat{y}(\\mathbf{x}_i)\\) ... value predicted by model from input vector \\(\\mathbf{x}_i\\)\n\nWhich of these measures are not meaningful as error measures on a numeric regression task?",
        "q": "$$L_2 = \\frac{1}{|\\mathcal{D}|} \\sum_{\\mathbf{x}_i \\in \\mathcal{D}} |y_i - \\hat{y}(\\mathbf{x}_i)|$$\n\nNot meaningful?",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "This is the Mean Absolute Error — a standard regression loss."
      },
      {
        "context": "4. Neural Networks and Deep Learning (a)\n\nConsider the following four possible loss functions for a regression problem, where\n- \\(y_i\\) ... true target value for example \\(\\mathbf{x}_i\\)\n- \\(\\hat{y}(\\mathbf{x}_i)\\) ... value predicted by model from input vector \\(\\mathbf{x}_i\\)\n\nWhich of these measures are not meaningful as error measures on a numeric regression task?",
        "q": "$$L_3 = \\frac{1}{|\\mathcal{D}|} \\sum_{\\mathbf{x}_i \\in \\mathcal{D}} (y_i - \\hat{y}(\\mathbf{x}_i))^2$$\n\nNot meaningful?",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "This is the Mean Squared Error — the classic regression loss."
      },
      {
        "context": "4. Neural Networks and Deep Learning (b)\n\nWeight Learning by Gradient Descent: Which of the following statements are true?",
        "q": "A loss function can also be defined over several (more than one) output units.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Multi-output losses (e.g., multi-class cross-entropy, multi-task losses) are common."
      },
      {
        "context": "4. Neural Networks and Deep Learning (b)\n\nWeight Learning by Gradient Descent: Which of the following statements are true?",
        "q": "A gradient of zero will result in unchanged weights.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Update \\(w \\leftarrow w - \\eta \\nabla L\\); with \\(\\nabla L = 0\\), \\(w\\) stays the same."
      },
      {
        "context": "4. Neural Networks and Deep Learning (b)\n\nWeight Learning by Gradient Descent: Which of the following statements are true?",
        "q": "A large learning rate may lead to convergence more quickly.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Larger steps can speed convergence (though too large causes divergence)."
      },
      {
        "context": "4. Neural Networks and Deep Learning (b)\n\nWeight Learning by Gradient Descent: Which of the following statements are true?",
        "q": "The gradient must be calculated for each weight in the network.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Every trainable weight needs its own partial derivative to be updated."
      },
      {
        "context": "4. Neural Networks and Deep Learning (b)\n\nWeight Learning by Gradient Descent: Which of the following statements are true?",
        "q": "A loss function can have more than one minimum.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Non-convex losses (typical for neural nets) have multiple local minima."
      },
      {
        "context": "4. Neural Networks and Deep Learning (b)\n\nWeight Learning by Gradient Descent: Which of the following statements are true?",
        "q": "A small learning rate leads to more complex neural network models.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Learning rate affects optimization speed, not model complexity (which is determined by architecture)."
      },
      {
        "context": "4. Neural Networks and Deep Learning (b)\n\nWeight Learning by Gradient Descent: Which of the following statements are true?",
        "q": "The gradient is a number in the range [-1,1].",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Gradients can be arbitrarily large in magnitude."
      },
      {
        "context": "4. Neural Networks and Deep Learning (c)\n\nOverfitting Avoidance: Which of the following strategies could help prevent overfitting in a neural network?",
        "q": "Decrease the number of hidden units.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Fewer units reduces model capacity, helping prevent overfitting."
      },
      {
        "context": "4. Neural Networks and Deep Learning (c)\n\nOverfitting Avoidance: Which of the following strategies could help prevent overfitting in a neural network?",
        "q": "Decrease the number of hidden layers.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Reducing depth reduces capacity, mitigating overfitting."
      },
      {
        "context": "4. Neural Networks and Deep Learning (c)\n\nOverfitting Avoidance: Which of the following strategies could help prevent overfitting in a neural network?",
        "q": "Reduce learning rate.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Learning rate affects optimization, not generalization."
      },
      {
        "context": "4. Neural Networks and Deep Learning (c)\n\nOverfitting Avoidance: Which of the following strategies could help prevent overfitting in a neural network?",
        "q": "Reduce the number of training iterations.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Early stopping is a classic overfitting-avoidance technique."
      },
      {
        "context": "4. Neural Networks and Deep Learning (c)\n\nOverfitting Avoidance: Which of the following strategies could help prevent overfitting in a neural network?",
        "q": "Limit the size of gradient; crop if too large.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Gradient clipping addresses exploding gradients, not overfitting."
      },
      {
        "context": "4. Neural Networks and Deep Learning (c)\n\nOverfitting Avoidance: Which of the following strategies could help prevent overfitting in a neural network?",
        "q": "Change weights in direction of the gradient (instead of in the negative direction).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "That would maximize loss, not avoid overfitting."
      },
      {
        "context": "5. Unsupervised Learning\n\nConsider the k-means clustering algorithm as described in the lecture slides.\n\n5. Unsupervised Learning (a)",
        "q": "What qualities of a cluster partitioning does the Mean Quantisation Error (MQE) implicitly try to encode?",
        "opts": [
          "The average size of the cluster centers",
          "The compactness of the clusters",
          "The average distance between cluster centers",
          "Equal distribution of examples among clusters",
          "The number of resulting clusters"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "MQE = mean distance of examples to their cluster center, which measures cluster compactness."
      },
      {
        "context": "5. Unsupervised Learning (b)\n\nWhich of the following definition variants of the Mean Quantisation Error (MQE) are equivalent, in the sense of leading to exact same behavior of the k-means algorithm?\n\n(1) $$\\frac{1}{|\\mathcal{D}|} \\sum_{\\mathbf{x}_i \\in \\mathcal{D}} D(\\mathbf{x}_i, c(\\mathbf{x}_i))$$\n\n(2) $$\\frac{1}{2} \\sum_{\\mathbf{x}_i \\in \\mathcal{D}} D(\\mathbf{x}_i, c(\\mathbf{x}_i))$$\n\n(3) $$\\frac{1}{|\\mathcal{D}|} \\sum_{\\mathbf{x}_i \\in \\mathcal{D}} e^{D(\\mathbf{x}_i, c(\\mathbf{x}_i))}$$",
        "q": "Which of the variants are equivalent?",
        "opts": [
          "all three are equivalent",
          "only (2) and (3) are equivalent",
          "only (1) and (2) are equivalent",
          "none; they may all lead to different behaviour",
          "only (1) and (3) are equivalent"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "All three are monotonic transformations of each other in the relevant sense; minimizing any of them assigns each point to its nearest center."
      },
      {
        "context": "5. Unsupervised Learning (c)\n\nWhich of the following statements about the Bayes Information Criterion (BIC) are true (here it is once more so that you don't have to look it up):\n\n$$BIC(M : \\mathcal{D}) = \\log P(\\mathcal{D} \\mid M) - p \\cdot \\frac{\\log |\\mathcal{D}|}{2}$$",
        "q": "If we multiplied the BIC score by some constant \\(c > 1\\), a model selection algorithm using this score would tend to return simpler models.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Multiplying by a positive constant doesn't change the argmax."
      },
      {
        "context": "5. Unsupervised Learning (c)\n\nWhich of the following statements about the Bayes Information Criterion (BIC) are true (here it is once more so that you don't have to look it up):\n\n$$BIC(M : \\mathcal{D}) = \\log P(\\mathcal{D} \\mid M) - p \\cdot \\frac{\\log |\\mathcal{D}|}{2}$$",
        "q": "If we removed the second term from the formula, leaving only \\(\\log P(\\mathcal{D} \\mid M)\\), the resulting measure would favor simple models, without regard to how well they fit the data.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Removing the complexity penalty leaves only the data fit term — favoring complex models that fit best."
      },
      {
        "context": "5. Unsupervised Learning (c)\n\nWhich of the following statements about the Bayes Information Criterion (BIC) are true (here it is once more so that you don't have to look it up):\n\n$$BIC(M : \\mathcal{D}) = \\log P(\\mathcal{D} \\mid M) - p \\cdot \\frac{\\log |\\mathcal{D}|}{2}$$",
        "q": "The second term of the formula puts a penalty on cluster partitionings that have a large number of objects per cluster.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "The penalty depends on the number of parameters \\(p\\), not on cluster occupancy."
      },
      {
        "context": "5. Unsupervised Learning (c)\n\nWhich of the following statements about the Bayes Information Criterion (BIC) are true (here it is once more so that you don't have to look it up):\n\n$$BIC(M : \\mathcal{D}) = \\log P(\\mathcal{D} \\mid M) - p \\cdot \\frac{\\log |\\mathcal{D}|}{2}$$",
        "q": "If we removed the second term from the formula, leaving only \\(\\log P(\\mathcal{D} \\mid M)\\), the resulting measure would favor models that maximally fit the data.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Without the complexity penalty, maximum likelihood is selected — i.e., maximal data fit."
      },
      {
        "context": "6. Hidden Markov Models\n\nWhich of the following statements about Hidden Markov Models (HMMs) are true?",
        "q": "In MAP classification of a particular observation sequence, the prior in Bayes' rule can be calculated from the HMM.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "The HMM gives the likelihood of observations; the class prior comes from outside the HMM."
      },
      {
        "context": "6. Hidden Markov Models\n\nWhich of the following statements about Hidden Markov Models (HMMs) are true?",
        "q": "The number of observation symbols must be equal to the number of states.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "These are independent dimensions of the HMM."
      },
      {
        "context": "6. Hidden Markov Models\n\nWhich of the following statements about Hidden Markov Models (HMMs) are true?",
        "q": "An observation matrix \\(\\mathbf{B}\\) may contain columns that consist of zeroes only.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "A column of zeroes would mean no state can emit that symbol, making it a useless symbol; furthermore columns aren't constrained to sum to one in B (rows are), but an all-zero column means an unreachable observation."
      },
      {
        "context": "6. Hidden Markov Models\n\nWhich of the following statements about Hidden Markov Models (HMMs) are true?",
        "q": "The state transition matrix \\(\\mathbf{A}\\) is always of square shape.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "\\(\\mathbf{A}\\) is N×N where N is the number of states."
      },
      {
        "context": "6. Hidden Markov Models\n\nWhich of the following statements about Hidden Markov Models (HMMs) are true?",
        "q": "The Forward Algorithm calculates the probability of a state sequence.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "It calculates the probability of an observation sequence (marginalizing over state sequences)."
      },
      {
        "context": "6. Hidden Markov Models\n\nWhich of the following statements about Hidden Markov Models (HMMs) are true?",
        "q": "If, in a given HMM with N states \\(s_1, \\ldots, s_N\\), \\(a_{ij} = P(s_i \\to s_j) = 1/N\\) for all \\(i, j\\), the same process could be modelled with just a single state.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Different states can still have different observation distributions, so they aren't reducible to a single state."
      },
      {
        "context": "6. Hidden Markov Models\n\nWhich of the following statements about Hidden Markov Models (HMMs) are true?",
        "q": "An observation model matrix \\(\\mathbf{B}\\) may contain zeroes.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Individual entries can be zero (a state may not emit a specific symbol)."
      },
      {
        "context": "6. Hidden Markov Models\n\nWhich of the following statements about Hidden Markov Models (HMMs) are true?",
        "q": "The Forward Algorithm calculates the probability of an observation sequence.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Yes — \\(P(O \\mid \\lambda)\\) summed over all state paths."
      },
      {
        "context": "6. Hidden Markov Models\n\nWhich of the following statements about Hidden Markov Models (HMMs) are true?",
        "q": "A HMM permits us to calculate the probability of any state sequence (disregarding observations) of arbitrary length.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Using initial probabilities and transition matrix \\(\\mathbf{A}\\), one can compute the probability of any state sequence."
      }
    ]
  },
  {
    "id": "pip2_ss22",
    "title": "Python Exam — JKU SS2022",
    "description": "JKU Programming in Python II exam from summer semester 2022 (45 graded questions on PyTorch, datasets, training, and ML basics).",
    "questions": [
      {
        "q": "What is the main purpose of a version control system (VCS)?",
        "opts": [
          "Automatic usage of the most recent Python package versions.",
          "Efficient tracking of files and their changes.",
          "Keeping all software versions up to date.",
          "Fast integration of unit tests."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Assume that you have a classification task where you want to classify images into either \"dog\" or \"cat\". Each image only contains a single dog or a single cat on some arbitrary background. Which of the following data augmentation techniques does NOT make sense?",
        "opts": [
          "adding noise",
          "applying input dropout",
          "zooming into the background",
          "flipping horizontally"
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Which of the following is NOT a typical data normalization/scaling approach?",
        "opts": [
          "Scaling to range [-1, 1].",
          "Scaling to zero (0) mean and unit (1) variance.",
          "Scaling to range [0, 1].",
          "Scaling to range \\(\\,[0, 10^{-15}]\\,\\)"
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "What is one primary purpose of the automatic parameter registration of `torch.nn.Module`?",
        "opts": [
          "To allow for easier debugging.",
          "To allow more inputs to the `forward` method.",
          "To collect all trainable parameters and provide convenient acces to them via the module's `parameters` method.",
          "To keep track of all parameters and assess whether they can be removed in order to increase performance."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "context": "Assume you have the raw model outputs `logits` as a PyTorch tensor with arbitrary floating point numbers in the range [-100, 100].",
        "q": "Which of the following code snippets is correct when the task is to get binary classification predictions `preds` (integer, either 0 or 1), given some prediction threshold `t` (float) in the range [0, 1] (assume correct imports)?",
        "opts": [
          "```python\npreds = (logits >= t).long()\n```",
          "```python\npreds = (torch.sigmoid(logits) * t).long()\n```",
          "```python\npreds = (torch.sigmoid(logits) >= t).long()\n```",
          "```python\npreds = logits.long() >= t\n```",
          "```python\npreds = (logits * t).long()\n```",
          "```python\npreds = torch.sigmoid(logits).long() >= t\n```"
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "context": "What does the following PyTorch image transformation composition do when applied on an image?\n\n```python\ntransforms = transforms.Compose([\n    transforms.Resize(4),\n    transforms.Grayscale(),\n    transforms.RandomRotation(degrees=180),\n    transforms.ToTensor()\n])\n```",
        "q": "Which statement describes its behavior?",
        "opts": [
          "It sequentially resizes an image, converts it to grayscale, applies randomized rotation and transforms it to a Pytorch tensor.",
          "It randomly performs one of the four transformations on an image.",
          "It randomly performs arbitrary many of the four transformations on an image.",
          "It sequentially transforms an image to a PyTorch tensor, applies randomized rotation, converts it to grayscale and resizes it."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Select the correct solution when asked to normalize (scale to range [0, 1]) some numpy array `arr`.",
        "opts": [
          "```python\narr * 0 + (1 * arr)\n```",
          "```python\n(arr - arr.mean()) / arr.std()\n```",
          "```python\narr / 255\n```",
          "```python\n(arr - arr.min()) / (arr.max() - arr.min())\n```"
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "You get data that measures the times it took for trees to grow. The measured times can be any real numbers in range [0, 1000]. Which type of data is this?",
        "opts": [
          "categorical data",
          "continuous data",
          "ordinal data",
          "discrete data"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "The `forward` method in context of `torch.nn.Module`...",
        "opts": [
          "...defines the module architecture.",
          "...specifies how a PyTorch module is applied (the \"flow\" through the module architecture).",
          "...pushes a PyTorch module to a given device.",
          "...adds a new forward layer to the network architecture of a module."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Categorical data can be described as:",
        "opts": [
          "Quantitative data with mathematical meaning and a natural ordering.",
          "A subset of numerical data with continuous values.",
          "Qualitative data without mathematical meaning but with a natural ordering.",
          "Qualitative data without mathematical meaning."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "What does independently and identically distributed (i.i.d.) mean?",
        "opts": [
          "Each sample has the same probability distribution as the others and all are mutually independent.",
          "Each sample has a different probability distribution as the others and all are mutually dependent.",
          "Each sample has the same probability distribution as the others and all are mutually dependent.",
          "Each sample has a different probability distribution as the others and all are mutually independent."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "What is the purpose of a loss function?",
        "opts": [
          "To get the predictions of a model.",
          "To change the model parameters.",
          "To compute the difference between the model ouput and the actual targets (ground truth).",
          "To compute the gradients for gradient-based iterative methods."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "context": "Assume that `MyModule` is a class properly derived from the `torch.nn.Module` class and `tensor_a` is a PyTorch tensor.\n\n```python\nmy_module = MyModule()\nmy_module(tensor_a)\n```",
        "q": "What does the code above do?",
        "opts": [
          "It raises an exception, since one can not create instances of `MyModule`.",
          "Creates an instance of `MyModule`. Then reads a sample into `tensor_a`.",
          "Creates an instance of `MyModule`. Then applies the `forward` method of `my_module` with argument `tensor_a`.",
          "Creates an instance of `MyModule`. Then calls the `__getitem__` method of `my_module` with argument `tensor_a`."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "context": "```python\nimport torch\nfrom torch.utils.data import Dataset, DataLoader\n\nclass MyDataset(Dataset):\n    def __getitem__(self, index):\n        return torch.tensor([1, 2, 3])\n\n    def __len__(self):\n        return 4\n\ndataset = MyDataset()\nloader = DataLoader(dataset, batch_size=2)\n\nfor i, x in enumerate(loader):\n    print(f\"{i}: {tuple(x.shape)}\")\n```",
        "q": "What is the output of the code above?",
        "opts": [
          "```\n0: (3, 2)\n1: (3, 2)\n```",
          "```\n0: (2, 3)\n1: (2, 3)\n```",
          "```\n0: (4, 3)\n```",
          "```\n0: (6,)\n```",
          "```\n0: (4, 2, 3)\n```",
          "```\n0: (3,)\n1: (3,)\n2: (3,)\n3: (3,)\n```"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "What can be a potential risk of data augmentation?",
        "opts": [
          "It can introduce artifacts or even change the task.",
          "There are no risks, data augmentation is always safe.",
          "It can increase the model complexity.",
          "It can increase the number of trainable parameters of a model."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "```python\nimport torch\n\nclass MyModule(torch.nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.conv = torch.nn.Conv2d(...)\n\n    def forward(self, x):\n        out1 = self.conv(x)\n        ...  # process \"out1\" so it can be an input to \"linear\"\n        linear = torch.nn.Linear(...)\n        out2 = linear(out1)\n        return out2\n```",
        "q": "Why is the code above problematic (you can assume correct inputs, shapes and arguments)?",
        "opts": [
          "`torch.nn.Linear` is assigned to a local identifier but `torch.nn.Conv2d` is not. Both should be defined to locals or the code will suffer from reproducibility.",
          "`torch.nn.Linear` must be invoked before passing the data to the convolutional layer.",
          "`torch.nn.Conv2d` can never be combined with `torch.nn.Linear`.",
          "The submodule `torch.nn.Linear` is created inside the `forward` method rather than the `__init__` method. This means that the submodule is repeatedly created in every `forward` call, including its random parameter initialization."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "`torch.utils.data.Dataset` can be used to derive a custom class that...",
        "opts": [
          "...specifies that architecture of a neural network model.",
          "...provides access to data via a standardized interface.",
          "...takes care of multiprocessing.",
          "...creates minibatches from samples."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "```python\nimport torch\n\nclass MyModule(torch.nn.Module):\n    def __init__(self, a):\n        super().__init__()\n        self.a = a\n\n    def forward(self, x):\n        output = x + self.a\n        return output\n\nmy_module = MyModule(2.0)\nc = my_module(5.0)\nprint(c)\n```",
        "q": "What is the output of the code above?",
        "opts": [
          "It raises an exception because `super().__init__()` should not be used with `torch.nn.Module`.",
          "It raises an exception because the `__getitem__` method is missing in `MyModule`.",
          "`7.0`",
          "It raises an exception at `self.a = a` because only PyTorch trainable parameters and submodules can be used as attribute."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Consider a binary classification task, where you have to classify patients into either healthy (negative) or diseased (positive). Your dataset is imbalanced, there are far more healthy patients than diseased patients. Which of the following evaluation metrics is the most fitting one to assess a model performance?",
        "opts": [
          "area under the receiver operating characteristic (ROC) curve (AUC)",
          "true negative rate (TNR)",
          "mean squared error (MSE)",
          "accuracy (ACC)"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Assume you want to normalize your data and compute a normalization constant from your dataset (e.g., the mean over many samples). What would be the correct way to proceed in terms of training and test set?",
        "opts": [
          "Determine the constant for normalization on the training data and apply it also to the test data.",
          "Determine the constant for normalization on the whole dataset and apply it to training and test data.",
          "Determine the constant for normalization on the test data and apply it also to the training data.",
          "Determine the constant for normalization on a random set of samples from training and test data and apply it to training and test data."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "```python\ndef my_hash(x):\n    return 125\n```",
        "q": "Which of the following statements is NOT correct regarding the hash function above?",
        "opts": [
          "The hash value is the same in different Python interpreter sessions.",
          "The computation of the hash value is fast.",
          "Up to 125 hash collisions can occur for unequal inputs.",
          "The hash function will work on any input."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "When translating PyTorch/Python code into a TorchScript program, there are two ways: scripting and tracing. Which of the following statements is correct?",
        "opts": [
          "Scripting: recording the operations of a PyTorch/Python program given some example input; control flow is ignored. Tracing: writing a TorchScript program directly; control flow is supported.",
          "Scripting: writing a TorchScript program directly; control flow is ignored. Tracing: recording the operations of a PyTorch/Python program given some example input; control flow is supported.",
          "Scripting: recording the operations of a PyTorch/Python program given some example input; control flow is supported. Tracing: writing a TorchScript program directly; control flow is ignored.",
          "Scripting: writing a TorchScript program directly; control flow is supported. Tracing: recording the operations of a PyTorch/Python program given some example input; control flow is ignored."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "context": "Consider the following incomplete implementation of a custom Dataset which should return image data as numpy arrays (assume `read_image` to be fully implemented):\n\n```python\nimport numpy as np\nfrom torch.utils.data import Dataset\n\ndef read_image(path: str) -> np.ndarray:\n    # reads an image from the path and returns a numpy array\n    ...\n\nclass MyDataset(Dataset):\n    def __init__(self, image_paths: list[str]):\n        self.image_paths = image_paths\n```",
        "q": "Which of the following is the correct implementation of the missing `__getitem__` method?",
        "opts": [
          "```python\ndef __getitem__(self, path):\n    return read_image(path)\n```",
          "```python\ndef __getitem__(self, index):\n    return np.array([index])\n```",
          "```python\ndef __getitem__(self, index):\n    path = self.image_paths[index]\n    return read_image(path)\n```",
          "```python\ndef __getitem__(self, index):\n    data = []\n    for path in self.image_paths:\n        data.append(read_image(path))\n    return data\n```"
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Which is the correct way to perform an update step on network parameters after the forward pass in PyTorch?",
        "opts": [
          "Set gradients to zero, calculate the loss, call `backward()` on the optimizer, call `step()` on the optimizer.",
          "Set gradients to zero, calculate the loss, call `backward()` on the loss, call `step()` on the optimizer.",
          "Set gradients to zero, calculate the loss, call `backward()` on the optimizer, call `step()` on the network.",
          "Set gradients to zero, calculate the loss, call `backward()` on the loss, call `step()` on the network."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "What does `collate_fn` (collate function) do in terms of `torch.utils.data.DataLoader`?",
        "opts": [
          "Specifies how a sample is loaded from the disk.",
          "Applies data augmentation methods to the samples.",
          "Specifies how the samples are combined into minibatches.",
          "Specifies the size of the subsets of the dataset."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "What is the purpose of the `zero_grad` method?",
        "opts": [
          "It is called on the loss (`loss.zero_grad()`) to set the associated trainable parameters to values for which the loss is zero.",
          "It is called on the optimizer (`optim.zero_grad()`) in order to set the associated trainable parameters to zero after a gradient update.",
          "It is called on the optimizer (`optim.zero_grad()`) in order to set the gradients of the associated trainable parameters to zero.",
          "It is called on the loss (`loss.zero_grad()`) to set the associated trainable parameters to values for which the loss has a vanishing gradient."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "An instance of the `torch.utils.data.DataLoader` class...",
        "opts": [
          "...creates minibatches from the samples returned by a `torch.utils.data.Dataset` instance.",
          "...represents a PyTorch Dataset and must include a `__getitem__` method.",
          "...splits the dataset into training and test set automatically.",
          "...must be passed to a PyTorch model and will automatically train it on all samples in the dataset."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "The `__init__` method in context of `torch.nn.Module`...",
        "opts": [
          "...specifies how a PyTorch module is applied (the \"flow\" through the module architecture).",
          "...defines the module architecture.",
          "...initializes all sub-modules based on the super-class.",
          "...is a replacement for `torch.nn.init`."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "What can be a potential benefit of data augmentation?",
        "opts": [
          "Overfitting can be reduced.",
          "The computational run time of the model can be increased.",
          "The computational run time of the model can be reduced.",
          "Overfitting can be increased."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "```python\nimport torch\n\ndef function(x: torch.Tensor):\n    return x if x.min() >= 0 else x * -1\n\nscripted_function = torch.jit.script(function)\ntraced_function = torch.jit.trace(function, example_inputs=torch.tensor([1, 2, 3]))\n\nactual_input = torch.tensor([-4, -5, -6])\nprint(\"s:\", scripted_function(actual_input).tolist())\nprint(\"t:\", traced_function(actual_input).tolist())\n```",
        "q": "What is the output of the code above?",
        "opts": [
          "```\ns: [-4, -5, -6]\nt: [4, 5, 6]\n```",
          "```\ns: [4, 5, 6]\nt: [-1, -2, -3]\n```",
          "```\ns: [-4, -5, -6]\nt: [-1, -2, -3]\n```",
          "```\ns: [4, 5, 6]\nt: [1, 2, 3]\n```",
          "```\ns: [4, 5, 6]\nt: [-4, -5, -6]\n```",
          "```\ns: [-4, -5, -6]\nt: [-4, -5, -6]\n```",
          "```\ns: [4, 5, 6]\nt: [4, 5, 6]\n```",
          "```\ns: [-4, -5, -6]\nt: [1, 2, 3]\n```"
        ],
        "ans": [
          4
        ],
        "multi": false
      },
      {
        "q": "Given a PyTorch optimizer `optim = torch.optim.SGD(my_model.parameters(), lr=0.01)`, what does `optim.step()` do and when should it be called?",
        "opts": [
          "It carries out an update on the registered trainable parameters of `my_model`. It should be called after the loss of the output of `my_model` has been calculated and `loss.backward()` has been called.",
          "It iterates to the next batch of training data in the training loop of `my_model`. It should be called after a the the parameters of `my_model` were updated.",
          "It increases the step size of `optim`. It should only be called before the loss of the output of `my_model` has been calculated and `loss.backward()` has been called.",
          "It calculates the gradients of `my_model` in the training loop. It should be called after the loss of the output of `my_model` has been calculated and `loss.backward()` has been called."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "What is a common loss function for regression tasks?",
        "opts": [
          "mean squared error",
          "cross entropy",
          "binary cross entropy",
          "stochastic gradient descent"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "What is the primary task of a hash function?",
        "opts": [
          "To compute whether two objects are equal.",
          "To compute a fixed-sized data vector for a given input.",
          "To make implementations of dictionaries and sets fast (high run-time performance).",
          "To compare image data."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which statement is NOT true about `torch.nn.Module`?",
        "opts": [
          "Trainable parameters are automatically registered when specified as attributes in the `__init__` method.",
          "`torch.nn.Module` can be used to implement custom neural networks in PyTorch.",
          "PyTorch datasets are automatically registered when specified as attributes in the `__init__` method.",
          "Other PyTorch modules are automatically registered when specified as attributes in the `__init__` method."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "When training a model using some gradient-based iterative method, how should the loss (computed with some loss function) change?",
        "opts": [
          "The loss should be minimized.",
          "The loss is irrelevant when training a model.",
          "The loss should be maximized.",
          "The loss should nearly stay constant (given some user-defined value)."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "When creating randomized data splits, a common thing to do is setting the seed of the used random number generators. Why is that?",
        "opts": [
          "To enable shuffling in the DataLoader istances.",
          "To make different libraries compatible with each other (e.g., data from numpy and data from torch).",
          "To allow for a faster program execution, as the seed is now just a constant.",
          "To get reproducible results, so that the splits always contain the same (randomized) samples."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "What does a binary confusion matrix contain?",
        "opts": [
          "Given regression predictions and the actual targets, it contains the counts how often the model was close, given some threshold.",
          "It contains the loss values of all iterations of a nested cross validation.",
          "Given some loss functions, it contains the minimum and maximum loss values of these functions.",
          "Given classification predictions and the actual targets, it contains the counts how often the model was correct and incorrect."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "In a supervised setting, how can one determine the performance of some machine learning model?",
        "opts": [
          "By using a loss function to compute the deviation between the model prediction and the true target.",
          "By averaging the gradients of the model and compare it to a specified threshold.",
          "By running a performance profiler on the model.",
          "By comparing the model input and the model prediction with each other."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "`torch.utils.data.Subset` can be used to...",
        "opts": [
          "...derive a custom class that creates minibatches from samples.",
          "...generate a Dataset from a subset of the original Dataset according to a list of indices.",
          "...distribute the sampling process over multiple sub-processes.",
          "...find a good subset of the input features, e.g., for dimensionality reduction."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Given a sample image `img` (type `PIL.Image`) and a PyTorch transformation pipeline `transforms` (type `torchvision.transforms.Compose`), which of the following is the correct way of applying the transformations on the image?",
        "opts": [
          "```python\ntransformed_img = img.apply(transforms)\n```",
          "```python\ntransformed_img = transforms(img)\n```",
          "```python\ntransformed_img = img(transforms)\n```",
          "```python\ntransformed_img = transforms.apply(img)\n```"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which training method corresponds to full-batch learning?",
        "opts": [
          "Train a model on individual data samples from the training dataset in each update.",
          "Divide the full training dataset into batches of several samples and use one batch per update.",
          "Train a model on the whole training dataset in each update.",
          "Divide the full training and test dataset into batches of several samples and use one batch per update."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "The special method `__getitem__` in a `torch.utils.data.Dataset` derived class should...",
        "opts": [
          "...calculate the mean of all samples.",
          "...return minibatched samples.",
          "...return one sample.",
          "...return the index of a specified sample."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "What is a hash collision?",
        "opts": [
          "Equal inputs result in the same hash code.",
          "Different inputs result in different hash codes.",
          "Equal inputs result in different hash codes.",
          "Different inputs result in the same hash code."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "What is data augmentation?",
        "opts": [
          "Creating new artificial samples by modifying existing samples.",
          "Randomly swapping targets/labels of samples while keeping the features the same.",
          "Creating data splits (training, validation, test splits).",
          "Creating new models by choosing different parameters."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Training a neural network for one epoch will...",
        "opts": [
          "...perform one weight update.",
          "...perform training until the model overfits on all training samples.",
          "...perform training for a fixed number of seconds.",
          "...perform one training iteration over all training samples."
        ],
        "ans": [
          3
        ],
        "multi": false
      }
    ]
  },
  {
    "id": "python_ss2024",
    "title": "Python Exam — JKU SS2024",
    "description": "Final exam for the Python course at JKU, SS2024. 41 questions covering PyTorch, TorchScript, data preprocessing, ML workflow and theory.",
    "questions": [
      {
        "q": "Given a sample image `img` (type `PIL.Image`) and a PyTorch transformation pipeline `transforms` (type `torchvision.transforms.v2.Compose`), which of the following is the correct way of applying the transformations on the image?",
        "opts": [
          "`transformed_img = transforms(img)`",
          "`transformed_img = img(transforms)`",
          "`transformed_img = transforms.apply(img)`",
          "`transformed_img = img.apply(transforms)`"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements are correct regarding TorchScript?",
        "opts": [
          "TorchScript creates serializable and optimizable models from PyTorch code.",
          "With TorchScript, serialized models can be deployed in environments other than Python (e.g., C++).",
          "Every TorchScript code is also valid Python code.",
          "Every Python code is also valid TorchScript code."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "What is the output of the following code?\n\n```python\nimport torch\n\ndef function(x: torch.Tensor):\n    if x.sum() < 0:\n        return x * -1\n    return x\n\nscripted_function = torch.jit.script(function)\ntraced_function = torch.jit.trace(function, example_inputs=torch.tensor([3, 4]))\nactual_input = torch.tensor([-1, -2])\nprint(\"s:\", scripted_function(actual_input).tolist())\nprint(\"t:\", traced_function(actual_input).tolist())\n```",
        "opts": [
          "s: [-1, -2] t: [3, 4]",
          "s: [-1, -2] t: [-1, -2]",
          "s: [-1, -2] t: [-3, -4]",
          "s: [1, 2] t: [3, 4]",
          "s: [1, 2] t: [-3, -4]",
          "s: [-1, -2] t: [1, 2]",
          "s: [1, 2] t: [-1, -2]",
          "s: [1, 2] t: [1, 2]"
        ],
        "ans": [
          6
        ],
        "multi": false
      },
      {
        "q": "You are measuring the air temperature every day (e.g., 14.23°C, 15.01°C, etc.). Which type of data is this?",
        "opts": [
          "Continuous numerical data",
          "Discrete numerical data",
          "Categorical data",
          "Ordinal data"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "You are given a data set from your employer for a new machine learning project. Which of the following statements should be taken into account?",
        "opts": [
          "The data might require preprocessing to make it work with machine learning models.",
          "The data might be incorrect (e.g., incorrect labeling).",
          "There might be more data (which your employer might not have considered as important but could still be useful).",
          "The data might include outlier values."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "What is the output of the following code?\n\n```python\nimport torch\n\nclass MyModule(torch.nn.Module):\n    def __init__(self, a):\n        super().__init__()\n        self.a = a\n    def forward(self, x):\n        return x + (2 * self.a)\n\nmy_module = MyModule(3)\nc = my_module(4)\nprint(c)\n```",
        "opts": [
          "10",
          "It raises an exception because the parameter x is not specified as a PyTorch tensor.",
          "It raises an exception because MyModule does not have any trainable parameters.",
          "It raises an exception because self.a is not a (sub)module."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements are correct regarding model parameters and hyperparameters?",
        "opts": [
          "Model parameters are adjusted during model training.",
          "Hyperparameters are a subset of the model parameters.",
          "Hyperparameters might influence the model architecture.",
          "Hyperparameters and model parameters are the same thing."
        ],
        "ans": [
          0,
          2
        ],
        "multi": true
      },
      {
        "q": "Assume that `MyModule` is a class properly derived from the `torch.nn.Module` class and `x, y, z` are PyTorch tensors. What does the following code do?\n\n```python\nmy_module = MyModule()\nmy_module(x, y, z)\n```",
        "opts": [
          "It creates an instance of MyModule. Then it (ultimately) calls the `__getitem__` method of my_module with arguments x, y, z.",
          "It creates an instance of MyModule. Then it (ultimately) calls the `backward` method of my_module with arguments x, y, z.",
          "It creates an instance of MyModule. Then it (ultimately) calls the `forward` method of my_module with arguments x, y, z.",
          "It creates an instance of MyModule. Then it (ultimately) calls the `__init__` method of my_module with arguments x, y, z."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Which of the following are typical data normalization/scaling approaches?",
        "opts": [
          "Scaling to range [-1, 1].",
          "Scaling to zero (0) mean and unit (1) variance.",
          "Scaling to range [min, max], where min and max are the minimum and maximum values of the data set.",
          "Scaling to range [0, 100]."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "What is the shape of the output tensor `result` when running the following code?\n\n```python\nimport torch\n\nclass MyModule(torch.nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.chain = torch.nn.Sequential(\n            torch.nn.Linear(in_features=16, out_features=24),\n            torch.nn.Sigmoid(),\n            torch.nn.Linear(in_features=24, out_features=2)\n        )\n    def forward(self, x):\n        return self.chain(x)\n\ninp = torch.rand(size=(32, 16))\nmy_module = MyModule()\nresult = my_module(inp)\n```",
        "opts": [
          "(16, 2)",
          "(32, 16)",
          "(32, 16, 2)",
          "(32, 24, 16, 2)",
          "(32, 24)",
          "(32, 24, 2)",
          "(24, 2)",
          "(32, 2)"
        ],
        "ans": [
          7
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements are correct regarding early stopping?",
        "opts": [
          "Early stopping cannot guarantee the best possible model.",
          "Early stopping can reduce the number of model parameters.",
          "Early stopping cannot be applied if the loss continuously changes.",
          "Early stopping can reduce the training duration."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Which of the following is the correct order of performing one weight update in PyTorch (you can assume that `optimizer` is a valid optimizer object)?",
        "opts": [
          "1. Compute loss 2. Compute gradients `loss.backward()` 3. Update weights `optimizer.step()` 4. Reset gradients `optimizer.zero_grad()`",
          "1. Compute loss 2. Compute gradients `loss.backward()` 3. Reset gradients `optimizer.zero_grad()` 4. Update weights `optimizer.step()`",
          "1. Compute loss 2. Update weights `optimizer.step()` 3. Compute gradients `loss.backward()` 4. Reset gradients `optimizer.zero_grad()`",
          "1. Reset gradients `optimizer.zero_grad()` 2. Compute loss 3. Update weights `optimizer.step()` 4. Compute gradients `loss.backward()`"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements are correct regarding scripting and tracing to create TorchScript programs?",
        "opts": [
          "Scripting requires an example input.",
          "With tracing, control flow such as branching is lost.",
          "The entire program must either be scripted or traced, mixing both approaches is not allowed.",
          "Scripting and tracing can be combined."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Which of the following are common steps when designing a machine learning project?",
        "opts": [
          "Assessing which software and hardware can and/or should be available.",
          "Considering which machine learning methods are fitting.",
          "Getting an overview of the data which is going to be used.",
          "Getting a clear definition and understanding of the project goal."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "What is the primary purpose of a `torch.utils.data.DataLoader`?",
        "opts": [
          "Loading the hyperparameters of a neural network model.",
          "Extracting the gradients from a gradient-based model.",
          "Extracting minibatches of samples from a `torch.utils.data.Dataset` instance.",
          "Loading the parameters of a neural network model."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Assume you apply the following PyTorch image transformation `transform_chain` to some example RGB image:\n\n```python\nimport torch\nfrom torchvision.transforms import v2\n\ntransform_chain = v2.Compose([\n    v2.PILToTensor(),\n    v2.ToDtype(torch.float32, scale=True),\n    v2.Resize(size=100),\n    v2.ColorJitter(),\n    v2.RandomRotation(degrees=180),\n    v2.RandomVerticalFlip(p=0.5),\n    v2.RandomHorizontalFlip(p=0.5)\n])\n```\n\nWhich of the following statements are correct?",
        "opts": [
          "The resulting image might be rotated.",
          "The resulting image will be in grayscale.",
          "The resulting image might be vertically flipped.",
          "The resulting image will be horizontally flipped.",
          "The resulting image is either both horizontally and vertically flipped, or not flipped at all.",
          "The resulting image will be a PyTorch tensor."
        ],
        "ans": [
          0,
          2,
          5
        ],
        "multi": true
      },
      {
        "q": "In a supervised setting, how can one determine the prediction performance of some machine learning model?",
        "opts": [
          "By averaging the gradients of the model and comparing it to a specified threshold.",
          "By using a loss function to compute the deviation between the model prediction and the true target.",
          "By running a performance profiler on the model.",
          "By comparing the model input and the model prediction with each other."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "The `forward` method of a class derived from `torch.nn.Module` ...",
        "opts": [
          "... pushes a PyTorch module to a given device.",
          "... specifies how an input is transformed into an output (the \"flow\" through the architecture).",
          "... adds a new forward layer to the network architecture of a module.",
          "... sets up the module architecture.",
          "... performs one weight update during training."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements must be taken into consideration when doing a literature review regarding a new machine learning project?",
        "opts": [
          "Wikis, blog posts, reddit and other similar sites can provide a good overview and introduction.",
          "If there is no matching literature, it means that the project cannot be done using machine learning.",
          "There can be research biases.",
          "Peer-reviewed literature can be a good way to get state-of-the-art information."
        ],
        "ans": [
          0,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are correct regarding online learning?",
        "opts": [
          "The batch size is a hyperparameter.",
          "Gradients might be contradicting.",
          "A single training sample is used for one update.",
          "It leads to smooth gradients."
        ],
        "ans": [
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are correct when talking about normalization/scaling?",
        "opts": [
          "It could be that applying normalization/scaling does not have any beneficial effects.",
          "Normalization/scaling cannot be used in conjunction with cross validation.",
          "Normalization/scaling is independent from the method/model.",
          "When applying normalization/scaling in a setting with a dedicated training and test set, care must be taken which data sets to use for computing normalization constants."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Training a neural network for one epoch will ...",
        "opts": [
          "... perform training for a fixed number of seconds.",
          "... perform one training iteration over all training samples.",
          "... perform one weight update.",
          "... perform training until the model overfits on all training samples."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements are correct regarding the following code (you can assume correct imports)?\n\n```python\ndef function(x):\n    if x.min() <= 0:\n        return 0\n    return x\n```",
        "opts": [
          "The code:\n```python\nscripted_function = torch.jit.script(function)\nscripted_function(torch.ones(3,))\n```\nworks.",
          "The code:\n```python\ntraced_function = torch.jit.trace(function, (torch.rand(5),))\ntraced_function(torch.ones(3,))\n```\nworks.",
          "The code:\n```python\ntraced_function = torch.jit.trace(function, (torch.rand(5),))\ntraced_function(123)\n```\nworks.",
          "The code:\n```python\nscripted_function = torch.jit.script(function)\nscripted_function(123)\n```\nworks."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which of the following code snippets are correct (you can assume correct imports and that `MyDataset(...)` returns a valid `torch.utils.data.Dataset` instance)?",
        "opts": [
          "```python\ndataset = MyDataset(...)\nloader = DataLoader(shuffle=True, batch_size=16)\nfor data in loader(dataset):\n    # do something\n```",
          "```python\ndataset = MyDataset(...)\nfor data in dataset:\n    loader = DataLoader(data, shuffle=True, batch_size=16)\n    samples = loader.get_minibatch()\n    # do something\n```",
          "```python\ndataset = MyDataset(...)\nloader = DataLoader(dataset, shuffle=True, batch_size=16)\nfor data in loader:\n    # do something\n```",
          "```python\ndataset = MyDataset(...)\nloader = DataLoader(dataset, shuffle=True, batch_size=16)\ndata = loader.get_minibatch()\n```"
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements are correct regarding a hash function?",
        "opts": [
          "A hash function is typically used as a non-linear activation function.",
          "A hash function is used to compute a fixed-sized data vector for a given input.",
          "A hash function should have a minimal number of (hash) collisions.",
          "A hash function can be used to hash the inputs of a neural network for improved performance."
        ],
        "ans": [
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Assume you want to normalize your data and compute a normalization constant from your data set (e.g., the mean over many samples). What would be the correct way to proceed in terms of training, validation and test set?",
        "opts": [
          "Determine the constant for normalization on the training data and apply it also to the validation and test data.",
          "Determine the constant for normalization on the training and test data and apply it also to the validation data.",
          "Determine the constant for normalization on the training and validation data and apply it also to the test data.",
          "Determine the constant for normalization on the whole data set and apply it to training, validation and test data.",
          "Determine the constant for normalization on the validation and test data and apply it also to the training data."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Assume a classification task where you want to predict the time of day based on images of analog clocks (clocks with a minute hand and an hour hand) that do not have any numbers on them. In a preprocessing step, all images were centered and aligned. Which of the following data augmentation techniques might be problematic?",
        "opts": [
          "Rotating by 180 degrees",
          "Flipping vertically",
          "Flipping horizontally",
          "Rotating by 90 degrees"
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are correct regarding cross validation?",
        "opts": [
          "Cross validation is helpful to utilize all samples for evaluating the model performance.",
          "k-fold cross validation means that the entire data set is split into k non-overlapping parts, (k-1) of which are used for training and the remaining one for testing (per iteration).",
          "Cross validation can only be used for small data sets.",
          "k-fold cross validation means that the entire data set is split into k non-overlapping parts, (k-1) of which are used for testing and the remaining one for training (per iteration)."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "The special method `__getitem__` in a `torch.utils.data.Dataset` derived class should ...",
        "opts": [
          "... return one sample.",
          "... return all samples.",
          "... return minibatched samples.",
          "... return the data set."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Assume you have the following categorical data in exactly this fixed order:\n\n**flower, tree, earth, water**\n\nYou are asked to create a one-hot encoding. Which of the following is the correct one-hot encoded representation of **earth**?",
        "opts": [
          "(0, 0, 1, 0)",
          "(1, 1, 1, 1)",
          "(0, 1, 0, 0)",
          "(1, 0, 0, 0)",
          "(0, 0, 0, 0)",
          "(0, 0, 0, 1)",
          "(1, 0, 1, 1)"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements are correct regarding monitoring a model during training?",
        "opts": [
          "Switching on monitoring improves the performance of the model.",
          "It enables an easier detection of over- or underfitting.",
          "It allows inspecting weights and gradients and how they change during training.",
          "It allows inspecting the losses and how they change during training."
        ],
        "ans": [
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Assume you have the following binary confusion matrix:\n\n```\n                 Predicted\n              positive negative\n             -------------------------\nActual positive |   40   |   10   |\n       negative |   35   |   15   |\n             -------------------------\n```\n\nWhich of the following statements are correct?",
        "opts": [
          "There are 35 true positives.",
          "The classification performance is perfect.",
          "Out of all samples, the used model predicted 50 to be positive.",
          "The used model is more likely to predict the positive class."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Which statements regarding PyTorch's `torch.nn.Module` are correct?",
        "opts": [
          "The `__init__` method sets up the model architecture.",
          "`__getitem__` method specifies how an input is transformed into an output (the \"flow\" through the architecture).",
          "It must not contain trainable parameters (`torch.nn.Parameter`).",
          "It is the base class for all neural network modules."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "You are training a neural network model using some gradient-based iterative method. The first training loss that you compute is non-zero, but continuing the training process does not change the loss in any way, i.e., it remains constant. Which of the following statements is correct?",
        "opts": [
          "The gradients are too big.",
          "The model is overfitting.",
          "The model is perfect (for every sample, it computes the expected output value).",
          "The model weights are not changed."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "What is the term \"generalization\" about?",
        "opts": [
          "It tells us how well our model will perform on future (unseen) data.",
          "A model that fits the training data well will also generalize well.",
          "It is about trying to find a model which overfits the data.",
          "Using a dedicated test set is important for evaluating the generalization capability of a model."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are true regarding data augmentation?",
        "opts": [
          "Data augmentation can reduce overfitting.",
          "Data augmentation can have a negative impact on the model performance.",
          "Data augmentation must only be applied on the evaluation set, not on the training set.",
          "Data augmentation is about deleting existing samples to balance the data set."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "Categorical data can be described as:",
        "opts": [
          "Quantitative data with mathematical meaning but without a natural ordering.",
          "Qualitative data without mathematical meaning.",
          "Quantitative data with mathematical meaning.",
          "Qualitative data with mathematical meaning.",
          "Quantitative data without mathematical meaning.",
          "Qualitative data without mathematical meaning but with a natural ordering."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which statements regarding PyTorch's automatic parameter registration of a `torch.nn.Module` are correct?",
        "opts": [
          "When assigned as attribute, a `torch.Tensor` will automatically be registered.",
          "When assigned as attribute, the trainable parameters of a `torch.nn.Module` (or submodule) will automatically be registered.",
          "If a module does not have any automatically registered parameters, an exception is raised.",
          "Calling the `forward` method of a `torch.nn.Module` is redundant if all parameters have already been registered automatically."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements regarding loss functions are correct?",
        "opts": [
          "There are different loss functions for different purposes (e.g., classification and regression).",
          "In gradient-based iterative methods, the derivative of the loss function (with respect to the model weights) must be computed.",
          "Typically, the lower the loss, the closer the model output is to the true target value.",
          "Loss functions play an essential role in Empirical Risk Minimization (ERM) and assessing the generalization capability of a model."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which of the following are benefits of a version control system (VCS) such as git?",
        "opts": [
          "Deployment of machine learning models into high performance environments (e.g., C++).",
          "Improved performance for deep neural networks.",
          "Efficient tracking of files and their changes.",
          "Automatic monitoring of neural network parameters."
        ],
        "ans": [
          2
        ],
        "multi": false
      }
    ]
  },
  {
    "id": "retry_ss23",
    "title": "Python Retry Exam 1 — JKU SS2023",
    "description": "PyTorch Module architecture, data augmentation, regularization techniques",
    "questions": [
      {
        "q": "The __init__ method of a class derived from torch.nn.Module ...",
        "opts": [
          "... is a shortcut for torch.nn.init.",
          "... initializes all submodules based on the superclass.",
          "... specifies how a PyTorch module is applied (the \"flow\" through the module architecture).",
          "... sets up the module architecture."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Given a sample image img (type PIL.Image) and a PyTorch transformation pipeline transforms (type torchvision.transforms.Compose), which of the following is the correct way of applying the transformations on the image?",
        "opts": [
          "transformed_img = transforms(img)",
          "transformed_img = transforms.apply(img)",
          "transformed_img = img.apply(transforms)",
          "transformed_img = img(transforms)"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "What is meant by the term \"regularization\" in the context of machine learning?",
        "opts": [
          "Input feature normalization.",
          "Choosing the correct activation function.",
          "Choosing the correct loss function.",
          "Techniques to reduce overfitting."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Die richtigen Antworten sind: It means that the model outputs are getting farther away from the true target values., It means that the model is not learning properly. What is a hyperparameter in the setting of machine learning?",
        "opts": [
          "It represents an internal model parameter that is adjusted during training.",
          "It represents a user-specified parameter that typically influences the model and/or training procedure.",
          "It represents the process of training and evaluating an algorithm.",
          "It represents a machine learning model class."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which of the following is the correct order of performing one weight update in PyTorch (you can assume that optimizer is a valid PyTorch optimizer object)?",
        "opts": [
          "1. Compute loss",
          "1. Compute loss",
          "1. Compute loss",
          "1. Reset gradients optimizer.zero_grad()"
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "2. Compute gradients loss.backward() 3. Update weights optimizer.step() 4. Reset gradients optimizer.zero_grad() Assume that you have one of many arbitrary 8 bit grayscale images img (NumPy array) that you want to globally normalize (=normalization on complete data set) to the range [0, 1]. Which of the following code snippets achieve this normalization?",
        "opts": [
          "(img - img.mean()) / img.std()",
          "(img - img.min()) / (img.max() - img.min())",
          "img * 0 + (1 * img)",
          "img / 255"
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "In a study, people are asked how often they went to the cinema during last year. Which type of data is this?",
        "opts": [
          "ordinal data",
          "continuous numerical data",
          "discrete numerical data",
          "categorical data"
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Assume that MyModule is a class properly derived from the torch.nn.Module class and tensor_a and tensor_b are PyTorch tensors. What does the following code do? my_module = MyModule()my_module(tensor_a, tensor_b)",
        "opts": [
          "It creates an instance of MyModule. Then it applies the forward method of my_module with arguments tensor_a and tensor_b.",
          "It raises an exception, since only a single argument can be provided when calling my_module.",
          "It raises an exception, since one cannot create instances of MyModule.",
          "It creates an instance of MyModule. Then it applies the forward method of my_module with argument tensor_b. tensor_a is ignored."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "tensor_b. What does independently and identically distributed (i.i.d.) mean?",
        "opts": [
          "Each sample has the same probability distribution as the others and all are mutually dependent.",
          "Each sample has the same probability distribution as the others and all are mutually independent.",
          "Each sample has a different probability distribution as the others and all are mutually independent.",
          "Each sample has a different probability distribution as the others and all are mutually dependent."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "What is the purpose of a loss function?",
        "opts": [
          "To compute the difference between the model ouput and the actual targets (ground truth).",
          "To change the model parameters.",
          "To compute the gradients for gradient-based iterative methods.",
          "To get the predictions of a model."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "What is git?",
        "opts": [
          "A neural network architecture.",
          "A Python package for numerical computations.",
          "A platform to host programming projects.",
          "A version control system (VCS)."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Which of the following are common loss functions for classification tasks?",
        "opts": [
          "Mean-squared error",
          "Cross entropy",
          "Sigmoid",
          "Stochastic gradient descent"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Why is the following code problematic (you can assume correct inputs, shapes and arguments)? import torch class MyModule(torch.nn.Module): def __init__(self): super().__init__() self.conv = torch.nn.Conv2d(...) def forward(self, x): out1 = self.conv(x) ... # process \"out1\" so it can be an input to \"linear\" linear = torch.nn.Linear(...) out2 = linear(out1) return out2",
        "opts": [
          "The submodule torch.nn.Linear is created inside the forward method rather than the __init__ method. This means that the",
          "torch.nn.Linear must be invoked before passing the data to the convolutional layer.",
          "torch.nn.Linear is assigned to a local identifier but torch.nn.Conv2d is not. Both should be defined to locals or the code will suffer",
          "torch.nn.Conv2d can never be combined with torch.nn.Linear."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "that the submodule is repeatedly created in every forward call, including its random parameter initialization. The special method __getitem__ in a torch.utils.data.Dataset derived class should ...",
        "opts": [
          "... return minibatched samples.",
          "... return all samples.",
          "... return one sample.",
          "... return the data set."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Die richtigen Antworten sind: An instance of this class would produce infinitely many samples., A sample returned by the __getitem__ method always contains the index and a randomly generated number. What is the output of the following code? import torch class MyModule(torch.nn.Module): def __init__(self, a): self.a = a def forward(self, x): output = x + self.a return output my_module = MyModule(2.0) c = my_module(5.0)print(c)",
        "opts": [
          "It raises an exception because the forward method is not called.",
          "It raises an exception because super().__init__() is missing in the __init__ method.",
          "It raises an exception at self.a = a because only PyTorch trainable parameters and (sub)modules can be used as attributes.",
          "7.0"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "What is the output of the following code? import torch def function(x: torch.Tensor): return x if x.min() < 0 else x * -1 scripted_function = torch.jit.script(function)traced_function = torch.jit.trace(function, example_inputs=torch.tensor([1, 2, 3])) actual_input = torch.tensor([-4, -5, -6])print(\"s:\", scripted_function(actual_input).tolist()) print(\"t:\", traced_function(actual_input).tolist())",
        "opts": [
          "s: [-4, -5, -6]",
          "s: [4, 5, 6]t: [4, 5, 6]",
          "s: [4, 5, 6]t: [1, 2, 3]",
          "s: [4, 5, 6]t: [-1, -2, -3]",
          "s: [-4, -5, -6]",
          "s: [-4, -5, -6]",
          "s: [-4, -5, -6]t: [-4, -5, -6]"
        ],
        "ans": [
          0,
          4,
          5
        ],
        "multi": true
      },
      {
        "q": "Die richtigen Antworten sind: Flipping horizontally, Applying input dropout, Adding slight noise Ordinal data can be described as:",
        "opts": [
          "Quantitative data with mathematical meaning but without a natural ordering.",
          "Qualitative data without mathematical meaning.",
          "Qualitative data without mathematical meaning but with a natural ordering.",
          "Quantitative data with mathematical meaning and a natural ordering."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Assume you have the following categorical data in exactly this fixed order: computer, system, software, hardware You are asked to create a one-hot encoding. Which of the following is the correct one-hot encoded representation of hardware?",
        "opts": [
          "(1, 0, 0, 0)",
          "(0, 0, 0, 0)",
          "(1, 1, 1, 1)",
          "(1, 1, 1, 0)",
          "(0, 1, 1, 1)",
          "(0, 0, 0, 1)"
        ],
        "ans": [
          5
        ],
        "multi": false
      },
      {
        "q": "Die richtigen Antworten sind: Monitoring might help in finding issues during training., Monitoring might aid in determining over- or underfitting. torch.utils.data.Subset can be used to ...",
        "opts": [
          "... generate a Dataset from a subset of the original Dataset according to a list of indices.",
          "... find a good subset of the input features, e.g., for dimensionality reduction.",
          "... distribute the sampling process over multiple sub-processes.",
          "... derive a custom class that creates minibatches from samples."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "In a supervised setting, how can one determine the performance of some machine learning model?",
        "opts": [
          "By averaging the gradients of the model and comparing it to a specified threshold.",
          "By comparing the model input and the model prediction with each other.",
          "By using a loss function to compute the deviation between the model prediction and the true target.",
          "By running a performance profiler on the model."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "What is the shape of the output tensor result when running the following code? import torch class MyModule(torch.nn.Module): def __init__(self): super().__init__() self.linear = torch.nn.Linear(in_features=4, out_features=6) def forward(self, x): out = self.linear(x) return torch.sigmoid(out) inp = torch.rand(size=(12, 4)) my_module = MyModule()result = my_module(inp)",
        "opts": [
          "(12, 4)",
          "(4, 6)",
          "(12,)",
          "(12, 6)",
          "(4,)",
          "(12, 4, 6)",
          "(6,)"
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "The forward method of a class derived from torch.nn.Module ...",
        "opts": [
          "... pushes a PyTorch module to a given device.",
          "... adds a new forward layer to the network architecture of a module.",
          "... sets up the module architecture.",
          "... specifies how a PyTorch module is applied (the \"flow\" through the module architecture)."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "What is the output of the following code? import torch from torch.utils.data import Dataset, DataLoader class MyDataset(Dataset): def __getitem__(self, index): return torch.tensor([1, 2, 3, 4]) def __len__(self): return 12 dataset = MyDataset() loader = DataLoader(dataset, batch_size=4) for i, x in enumerate(loader): print(f\"{i}: {tuple(x.shape)}\")",
        "opts": [
          "0: (36,)",
          "0: (12, 4, 4)",
          "0: (4, 4)",
          "0: (4, 12, 4)",
          "0: (4,)1: (4,)",
          "0: (12, 4)"
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "What does collate_fn (collate function) do in terms of torch.utils.data.DataLoader?",
        "opts": [
          "It specifies the size of the subsets of the dataset.",
          "It specifies how a sample is loaded from the disk.",
          "It applies data augmentation methods to the samples.",
          "It specifies how the samples are combined into minibatches."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "If you start a new machine learning project, which of the following is one of the first steps that you should take?",
        "opts": [
          "Renting cloud-based hardware.",
          "Implementing the code for training and testing a neural network model.",
          "Creating training, evaluation and test datasets.",
          "Looking into the current state of research."
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "Training a neural network for one epoch will ...",
        "opts": [
          "... perform training for a fixed number of seconds.",
          "... perform training until the model overfits on all training samples.",
          "... perform one training iteration over all training samples.",
          "... perform one weight update."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "What is a hash collision?",
        "opts": [
          "Different inputs result in the same hash code.",
          "Equal inputs result in the same hash code.",
          "Different inputs result in different hash codes.",
          "Equal inputs result in different hash codes."
        ],
        "ans": [
          0
        ],
        "multi": false
      }
    ]
  },
  {
    "id": "ss2024_retry1",
    "title": "Python Retry Exam — JKU SS2024",
    "description": "JKU SS2024 Programming in Python II retry exam (25 September 2024) covering PyTorch, data preparation, training procedures and ML fundamentals.",
    "questions": [
      {
        "context": "Assume you have the following categorical data in exactly this fixed order:\n\n```\nbird, dog, cat, fish\n```",
        "q": "You are asked to create a one-hot encoding. Which of the following is the correct one-hot encoded representation of `bird`?",
        "opts": [
          "(1, 0, 1, 1)",
          "(0, 1, 0, 0)",
          "(0, 0, 0, 1)",
          "(1, 0, 0, 0)",
          "(0, 0, 0, 0)",
          "(0, 0, 1, 0)",
          "(1, 1, 1, 1)"
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "context": "Assume you apply the following PyTorch image transformation `transform_chain` to some example RGB image:",
        "q": "```python\nimport torch\nfrom torchvision.transforms import v2\n\ntransform_chain = v2.Compose([\n    v2.PILToTensor(),\n    v2.ToDtype(torch.float32, scale=True),\n    v2.Resize(size=100),\n    v2.ColorJitter(),\n    v2.RandomRotation(degrees=180),\n    v2.RandomVerticalFlip(p=0.5),\n    v2.RandomHorizontalFlip(p=0.5)\n])\n```\n\nWhich of the following statements are correct?",
        "opts": [
          "The resulting image might be vertically flipped.",
          "The resulting image might be horizontally flipped.",
          "The resulting image might have its colors changed.",
          "The resulting image might be rotated."
        ],
        "ans": [
          0,
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "The `forward` method of a class derived from `torch.nn.Module` ...",
        "opts": [
          "... computes the gradients.",
          "... sets up the module architecture.",
          "... specifies how an input is transformed into an output (the \"flow\" through the architecture).",
          "... performs one weight update during training.",
          "... pushes a PyTorch module to a given device."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements are correct regarding scripting and tracing to create TorchScript programs?",
        "opts": [
          "Scripting and tracing cannot be combined.",
          "Tracing requires an example input.",
          "Both scripting and tracing turn Python code into TorchScript code.",
          "With scripting, control flow such as branching is lost."
        ],
        "ans": [
          1,
          2
        ],
        "multi": true
      },
      {
        "context": "Consider the following `Dataset` implementation:",
        "q": "```python\nimport numpy as np\nfrom torch.utils.data import Dataset\n\nclass MyDataset(Dataset):\n    def __getitem__(self, index):\n        rng = np.random.default_rng(seed=index)\n        return index, rng.random()\n```\n\nWhich of the following statements are correct?",
        "opts": [
          "For a given `index`, the data set always returns the same sample.",
          "An instance of this class would produce infinitely many samples.",
          "An instance of this class cannot be processed by a `torch.utils.data.DataLoader` because of the randomness.",
          "A sample returned by the `__getitem__` method always contains the index and a randomly generated number."
        ],
        "ans": [
          0,
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "What is the output of the following code?\n\n```python\nimport torch\n\nclass MyModule(torch.nn.Module):\n    def __init__(self, x):\n        super().__init__()\n        self.x = x\n\nmy_module = MyModule(2)\nresult = my_module(5)\nprint(result)\n```",
        "opts": [
          "2",
          "It raises an exception because `MyModule` does not have a `forward` method.",
          "10",
          "It raises an exception because `MyModule` does not have any trainable parameters.",
          "It raises an exception because `self.x` is not a (sub)module.",
          "7",
          "5"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which of the following are benefits of a version control system (VCS) such as git?",
        "opts": [
          "Improved performance for deep neural networks.",
          "Useful for collaboration.",
          "Makes hyperparameter tuning easier.",
          "Efficient tracking of files and their changes."
        ],
        "ans": [
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Assume a classification task where you want to classify handwritten digits (0-9) which are available as grayscale images. Which of the following data augmentation techniques are useful?",
        "opts": [
          "Adding slight noise.",
          "Rotating by +-5 degrees.",
          "Modifying color channels.",
          "Flipping vertically."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are correct when talking about normalization/scaling?",
        "opts": [
          "Applying normalization/scaling is always beneficial, regardless of the used methods/models.",
          "Normalization/scaling cannot be used in conjunction with cross validation.",
          "When applying normalization/scaling in a setting with a dedicated training and test set, care must be taken which data sets to use for computing normalization constants.",
          "Normalization/scaling depends on the data set."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are true regarding data augmentation?",
        "opts": [
          "Data augmentation reduces underfitting.",
          "Data augmentation can have a negative impact on the model performance.",
          "Data augmentation is about creating \"new\" artificial samples by modifying existing samples.",
          "Data augmentation can have a positive impact on the model performance."
        ],
        "ans": [
          1,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "The special method `__getitem__` in a `torch.utils.data.Dataset` derived class should ...",
        "opts": [
          "... return all test samples.",
          "... return minibatched samples.",
          "... return one sample.",
          "... return all training samples."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Training a neural network for one update will ...",
        "opts": [
          "... perform training until early stopping is applied.",
          "... perform one weight update.",
          "... perform one training iteration over all training samples.",
          "... perform training for a fixed number of iterations."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "You are counting the number of completed home exercises. Which type of data is this?",
        "opts": [
          "Discrete numerical data",
          "Continuous numerical data",
          "Categorical data",
          "Ordinal data"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Assume you want to normalize your data and compute a normalization constant from your data set (e.g., the mean over many samples). What would be the correct way to proceed in terms of training, validation and test set?",
        "opts": [
          "Determine the constant for normalization on the training data and apply it also to the validation and test data.",
          "Determine the constant for normalization on the validation and test data and apply it also to the training data.",
          "Determine the constant for normalization on the whole data set and apply it to training, validation and test data.",
          "Determine the constant for normalization on the training and test data and apply it also to the validation data.",
          "Determine the constant for normalization on the training and validation data and apply it also to the test data."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "The `__init__` method of a class derived from `torch.nn.Module` ...",
        "opts": [
          "... sets up the module architecture.",
          "... specifies how an input is transformed into an output (the \"flow\" through the architecture).",
          "... initializes all submodules based on the superclass.",
          "... initializes the training procedure."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "What is the shape of the output tensor `result` when running the following code?\n\n```python\nimport torch\n\nclass MyModule(torch.nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.linear = torch.nn.Linear(in_features=64, out_features=32)\n\n    def forward(self, x):\n        out = self.linear(x)\n        return torch.sigmoid(out)\n\ninp = torch.rand(size=(128, 64))\nmy_module = MyModule()\nresult = my_module(inp)\n```",
        "opts": [
          "(64,)",
          "(128, 64, 32)",
          "(128, 64)",
          "(64, 32)",
          "(128, 32)",
          "(128,)",
          "(32,)"
        ],
        "ans": [
          4
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements are correct regarding TorchScript?",
        "opts": [
          "TorchScript code can provide a performance speed-up.",
          "Every TorchScript code is also valid Python code.",
          "Every Python code is also valid TorchScript code.",
          "TorchScript eases the implementation of neural networks compared to plain Python."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "In a supervised setting, how can one determine the prediction performance of some machine learning model?",
        "opts": [
          "By running a performance profiler on the model.",
          "By averaging the gradients of the model and comparing it to a specified threshold.",
          "By using a loss function to compute the deviation between the model prediction and the true target.",
          "By comparing the model input and the model prediction with each other."
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "q": "Which of the following are typical data normalization/scaling approaches?",
        "opts": [
          "Scaling to zero (0) mean and unit (1) variance.",
          "Scaling to range [-1, 1].",
          "Scaling to range [0, 1].",
          "Scaling to range [-infinity, +infinity]."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which of the following are common steps when designing a machine learning project?",
        "opts": [
          "Assessing which software and hardware can and/or should be available.",
          "Checking related work to see if similar problems have already been studied.",
          "Getting a clear definition and understanding of the project goal.",
          "Starting a hyperparameter search for a neural network model because this might take a long time and is thus recommended to start early, i.e., in the design phase."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which of the following is the correct order of performing one weight update in PyTorch (you can assume that `optimizer` is a valid PyTorch optimizer object)?",
        "opts": [
          "1. Compute loss\n2. Update weights `optimizer.step()`\n3. Compute gradients `loss.backward()`\n4. Reset gradients `optimizer.zero_grad()`",
          "1. Compute loss\n2. Compute gradients `loss.backward()`\n3. Reset gradients `optimizer.zero_grad()`\n4. Update weights `optimizer.step()`",
          "1. Reset gradients `optimizer.zero_grad()`\n2. Compute loss\n3. Update weights `optimizer.step()`\n4. Compute gradients `loss.backward()`",
          "1. Compute loss\n2. Compute gradients `loss.backward()`\n3. Update weights `optimizer.step()`\n4. Reset gradients `optimizer.zero_grad()`"
        ],
        "ans": [
          3
        ],
        "multi": false
      },
      {
        "q": "When is a model considered to be overfitting?",
        "opts": [
          "A model is overfitting if its training loss becomes increasingly large.",
          "A model is overfitting if it fits the training data too well, which leads to decreased generalization performance.",
          "A model is overfitting if the number of parameters approaches the number of hyperparameters.",
          "A model is overfitting if it does not fit the training data well at all, which leads to decreased generalization performance."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements regarding a `torch.utils.data.DataLoader` are correct?",
        "opts": [
          "It extracts minibatches of samples from a `torch.utils.data.Dataset` instance.",
          "It supports shuffling.",
          "It supports multi-processing.",
          "It splits the data into training and test sets."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are correct regarding minibatch learning?",
        "opts": [
          "Minibatch tries to combine the benefits of online learning and full-batch learning.",
          "A single training sample is used for one update.",
          "`b` samples are used for one update, where `b` is the batch size.",
          "The batch size is a hyperparameter."
        ],
        "ans": [
          0,
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "Which statements regarding PyTorch's `torch.nn.Module` are correct?",
        "opts": [
          "Many predefined PyTorch modules exist.",
          "It is the base class for all data sets.",
          "It can contain and utilize other modules.",
          "It can contain trainable parameters (`torch.nn.Parameter`)."
        ],
        "ans": [
          0,
          2,
          3
        ],
        "multi": true
      },
      {
        "context": "Which of the following statements are correct regarding the following function and with respect to TorchScript?",
        "q": "```python\ndef function(x):\n    if x.min() <= 0:\n        return 0\n    return x\n```",
        "opts": [
          "Scripting the function is possible.",
          "Tracing the function is not possible.",
          "Tracing the function is possible.",
          "Scripting the function is not possible."
        ],
        "ans": [
          2,
          3
        ],
        "multi": true
      },
      {
        "q": "What is a hyperparameter in the setting of machine learning?",
        "opts": [
          "It represents the process of training and evaluating an algorithm.",
          "It represents a user-specified parameter that typically influences the model and/or training procedure.",
          "It represents the number of model parameters.",
          "It represents an internal model parameter that is adjusted during training."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements must be taken into consideration when doing a literature review regarding a new machine learning project?",
        "opts": [
          "Wikis, blog posts, reddit and other similar sites can provide a good overview and introduction",
          "Peer-reviewed literature can be a good way to get state-of-the-art information.",
          "There can be research biases.",
          "If there is no matching literature, it means that the project cannot be done using machine learning."
        ],
        "ans": [
          0,
          1,
          2
        ],
        "multi": true
      },
      {
        "context": "Assume that `MyModule` is a class properly derived from the `torch.nn.Module` class and `x`, `y`, `z` are PyTorch tensors. Which of the following statements are correct regarding the following code?",
        "q": "```python\nmy_module = MyModule(x, y)\nmy_module(z)\n```",
        "opts": [
          "It creates an instance of `MyModule` and calls the `__init__` method with argument `z`.",
          "It (ultimately) calls the `forward` method of `my_module` with argument `z`.",
          "It (ultimately) calls the `forward` method of `my_module` with arguments `x, y`.",
          "It creates an instance of `MyModule` and calls the `__init__` method with arguments `x, y, z`.",
          "It creates an instance of `MyModule` and calls the `__init__` method with arguments `x, y`.",
          "It (ultimately) calls the `forward` method of `my_module` with arguments `x, y, z`."
        ],
        "ans": [
          1,
          4
        ],
        "multi": true
      },
      {
        "q": "You are training a neural network model using some gradient-based iterative method. The first training loss that you compute is rather high. Continuing the training process then leads to a gradually lower loss. Which of the following statements are correct?",
        "opts": [
          "The training appears to be working, i.e., the performance is improving.",
          "The gradients are zero.",
          "The model is getting continuously worse, since the loss should get higher during training.",
          "The model parameters are changing."
        ],
        "ans": [
          0,
          3
        ],
        "multi": true
      },
      {
        "q": "What is meant by the term \"regularization\" in the context of machine learning?",
        "opts": [
          "Techniques to reduce underfitting.",
          "Techniques to reduce overfitting.",
          "Using cross entropy as loss.",
          "Replacing non-linear activation functions with linear activation functions."
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "q": "What is the output of the following code?\n\n```python\nimport torch\n\ndef function(x: torch.Tensor):\n    return -x if x.sum() < 0 else x\n\nscripted_function = torch.jit.script(function)\ntraced_function = torch.jit.trace(function, example_inputs=torch.tensor([0, -1]))\n\nactual_input = torch.tensor([1, 2, 3])\nprint(\"s:\", scripted_function(actual_input).tolist())\nprint(\"t:\", traced_function(actual_input).tolist())\n```",
        "opts": [
          "s: [1, 2, 3]\nt: [0, 1]",
          "s: [-1, -2, -3]\nt: [-1, -2, -3]",
          "s: [-1, -2, -3]\nt: [1, 2, 3]",
          "s: [1, 2, 3]\nt: [0, -1]",
          "s: [1, 2, 3]\nt: [-1, -2, -3]",
          "s: [-1, -2, -3]\nt: [0, -1]",
          "s: [-1, -2, -3]\nt: [0, 1]",
          "s: [1, 2, 3]\nt: [1, 2, 3]"
        ],
        "ans": [
          4
        ],
        "multi": false
      },
      {
        "context": "Assume you have the following binary confusion matrix:\n\n```\n                    Predicted\n              positive   negative\n------------------------------------\nActual positive |  40         0   |\n       negative |  55         5   |\n------------------------------------\n```",
        "q": "Which of the following statements are correct?",
        "opts": [
          "The model is more likely to predict the positive class.",
          "The model never made an incorrect classification regarding the actually negative samples.",
          "The model never made an incorrect classification regarding the actually positive samples.",
          "The classification performance is close to perfect (only off by 5 samples)."
        ],
        "ans": [
          0,
          2
        ],
        "multi": true
      },
      {
        "q": "Which of the following problems might occur when working with a new data set?",
        "opts": [
          "Empty or corrupted files.",
          "Missing datapoints.",
          "Outlier values.",
          "Incorrect labeling.",
          "Duplicated datapoints.",
          "Wrong filetypes."
        ],
        "ans": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "multi": true
      },
      {
        "q": "What does independently and identically distributed (i.i.d.) mean?",
        "opts": [
          "Each sample has the same probability distribution as the others and all are mutually independent.",
          "Each sample has the same probability distribution as the others and all are mutually dependent.",
          "Each sample has a different probability distribution as the others and all are mutually independent.",
          "Each sample has a different probability distribution as the others and all are mutually dependent."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which of the following statements are correct regarding a hash function?",
        "opts": [
          "A hash function should ideally be fast to compute.",
          "A hash function is used to compute a variably sized data vector for a given input.",
          "A hash function is typically used as a non-linear activation function.",
          "A hash function can only be used for files."
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "q": "Which statements regarding PyTorch's automatic parameter registration of a `torch.nn.Module` are correct?",
        "opts": [
          "When assigned as attribute, a `torch.nn.Parameter` will automatically be registered.",
          "When assigned as attribute, a `torch.nn.Module`'s trainable parameters will automatically be registered.",
          "When assigned as attribute, a `torch.Tensor` will automatically be registered.",
          "When assigned as attribute, a `torch.utils.data.Dataset`'s parameters will automatically be registered."
        ],
        "ans": [
          0,
          1
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are correct regarding numerical data?",
        "opts": [
          "Can be discrete.",
          "Has a quantative meaning.",
          "Has a qualitative meaning.",
          "Can be continuous."
        ],
        "ans": [
          0,
          1,
          3
        ],
        "multi": true
      },
      {
        "q": "Which of the following statements are correct regarding monitoring a model during training?",
        "opts": [
          "It enables an easier detection of over- or underfitting.",
          "It reduces the time needed for training.",
          "It allows inspecting weights and gradients and how they change during training.",
          "It increases the model performance."
        ],
        "ans": [
          0,
          2
        ],
        "multi": true
      },
      {
        "q": "What is the purpose of a loss function?",
        "opts": [
          "To compute the difference between the model ouput and the actual targets (ground truth).",
          "To compute the quality of the input data.",
          "To compute the gradients for gradient-based iterative methods.",
          "To compute the run-time performance of a model."
        ],
        "ans": [
          0
        ],
        "multi": false
      }
    ]
  },
  {
    "id": "mlpc_retake1",
    "title": "MLPC Retake Exam 1 — JKU",
    "description": "Machine Learning Pattern Classification retake exam",
    "questions": [
      {
        "context": "Bayesian Classification. Consider Bayes' Rule for classification: \\(P(\\omega_i \\mid \\boldsymbol{x}) = \\frac{p(\\boldsymbol{x} \\mid \\omega_i) P(\\omega_i)}{p(\\boldsymbol{x})}\\). Assume a classification problem with 5 (fish) classes, a 100-dimensional real-valued feature space, and a training set \\(\\mathcal{D}\\) consisting of 5000 examples. Which of the following statements are correct?",
        "q": "For any fish \\(\\boldsymbol{x} \\in \\mathcal{D}\\), \\(p(\\boldsymbol{x}) \\leq 1/5000\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "p(x) is a continuous density, not bounded by 1/N."
      },
      {
        "context": "Bayesian Classification. Consider Bayes' Rule for classification: \\(P(\\omega_i \\mid \\boldsymbol{x}) = \\frac{p(\\boldsymbol{x} \\mid \\omega_i) P(\\omega_i)}{p(\\boldsymbol{x})}\\). Assume a classification problem with 5 (fish) classes, a 100-dimensional real-valued feature space, and a training set \\(\\mathcal{D}\\) consisting of 5000 examples. Which of the following statements are correct?",
        "q": "For any fish \\(\\boldsymbol{x} \\in \\mathcal{D}\\), \\(p(\\boldsymbol{x})\\) is a vector with 100 values",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "p(x) is a scalar density value."
      },
      {
        "context": "Bayesian Classification. Consider Bayes' Rule for classification: \\(P(\\omega_i \\mid \\boldsymbol{x}) = \\frac{p(\\boldsymbol{x} \\mid \\omega_i) P(\\omega_i)}{p(\\boldsymbol{x})}\\). Assume a classification problem with 5 (fish) classes, a 100-dimensional real-valued feature space, and a training set \\(\\mathcal{D}\\) consisting of 5000 examples. Which of the following statements are correct?",
        "q": "For any \\(\\boldsymbol{x}\\), \\(\\sum_i p(\\boldsymbol{x} \\mid \\omega_i) = 1.0\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Densities for different classes do not sum to 1 over classes; they integrate to 1 over x."
      },
      {
        "context": "Bayesian Classification. Consider Bayes' Rule for classification: \\(P(\\omega_i \\mid \\boldsymbol{x}) = \\frac{p(\\boldsymbol{x} \\mid \\omega_i) P(\\omega_i)}{p(\\boldsymbol{x})}\\). Assume a classification problem with 5 (fish) classes, a 100-dimensional real-valued feature space, and a training set \\(\\mathcal{D}\\) consisting of 5000 examples. Which of the following statements are correct?",
        "q": "\\(P(\\omega_1 \\mid \\boldsymbol{x})\\) is a vector with 5 entries",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "It is a scalar posterior for class 1."
      },
      {
        "context": "Minimum-Risk Classifier (zero-one loss). Consider the \\(5 \\times 5\\) zero-one loss function \\(\\lambda\\) for the above 5-class problem, a specific set of prior and class-conditional distributions learned from some training set, and a Bayesian Minimum-Risk Classifier as described in the lecture slides. Which of the following statements are correct?",
        "q": "When tested on some specific test set \\(\\mathcal{T}\\), the minimum-risk classifier will end up in exactly the same position in ROC space as a MAP classifier",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Under zero-one loss, the minimum-risk classifier is equivalent to MAP."
      },
      {
        "context": "Minimum-Risk Classifier (zero-one loss). Consider the \\(5 \\times 5\\) zero-one loss function \\(\\lambda\\) for the above 5-class problem, a specific set of prior and class-conditional distributions learned from some training set, and a Bayesian Minimum-Risk Classifier as described in the lecture slides. Which of the following statements are correct?",
        "q": "\\(\\sum_i \\sum_j \\lambda_{ij} = 1.0\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "For 5x5 zero-one loss, the off-diagonal sum is 20, not 1."
      },
      {
        "context": "Minimum-Risk Classifier (zero-one loss). Consider the \\(5 \\times 5\\) zero-one loss function \\(\\lambda\\) for the above 5-class problem, a specific set of prior and class-conditional distributions learned from some training set, and a Bayesian Minimum-Risk Classifier as described in the lecture slides. Which of the following statements are correct?",
        "q": "If we multiply all values in \\(\\lambda\\) by 5, the result will be an invalid loss function",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Scaling a loss function by a positive constant yields a valid loss function."
      },
      {
        "context": "Density Estimation. Consider a figure from the lecture slides in the context of estimating the mean \\(\\mu\\) of a normal distribution (with given fixed variance) from a set of observations in a 1D dataset. The figure shows three stacked plots: the top plot shows the data and candidate normal densities, the middle plot shows the likelihood function as a function of \\(\\mu\\), and the bottom plot shows the log-likelihood (with negative y values). Answer the following questions:",
        "q": "The likelihood function cannot be negative anywhere",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Likelihoods are products of densities, which are non-negative."
      },
      {
        "context": "Density Estimation. Consider a figure from the lecture slides in the context of estimating the mean \\(\\mu\\) of a normal distribution (with given fixed variance) from a set of observations in a 1D dataset. The figure shows three stacked plots: the top plot shows the data and candidate normal densities, the middle plot shows the likelihood function as a function of \\(\\mu\\), and the bottom plot shows the log-likelihood (with negative y values). Answer the following questions:",
        "q": "The y values in the lower plot cannot be probabilities, because they are negative",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "The lower plot shows log-likelihood values, which can be negative."
      },
      {
        "context": "Density Estimation. Consider a figure from the lecture slides in the context of estimating the mean \\(\\mu\\) of a normal distribution (with given fixed variance) from a set of observations in a 1D dataset. The figure shows three stacked plots: the top plot shows the data and candidate normal densities, the middle plot shows the likelihood function as a function of \\(\\mu\\), and the bottom plot shows the log-likelihood (with negative y values). Answer the following questions:",
        "q": "In the figure, the likelihood function is the plot",
        "opts": [
          "at the top",
          "at the bottom",
          "at the middle"
        ],
        "ans": [
          2
        ],
        "multi": false
      },
      {
        "context": "Density Estimation. Consider a figure from the lecture slides in the context of estimating the mean \\(\\mu\\) of a normal distribution (with given fixed variance) from a set of observations in a 1D dataset. The figure shows three stacked plots: the top plot shows the data and candidate normal densities, the middle plot shows the likelihood function as a function of \\(\\mu\\), and the bottom plot shows the log-likelihood (with negative y values). Answer the following questions:",
        "q": "The likelihood function is itself a normal distribution",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "The likelihood as a function of the parameter is not a normalized probability distribution."
      },
      {
        "context": "Density Estimation. Consider a figure from the lecture slides in the context of estimating the mean \\(\\mu\\) of a normal distribution (with given fixed variance) from a set of observations in a 1D dataset. The figure shows three stacked plots: the top plot shows the data and candidate normal densities, the middle plot shows the likelihood function as a function of \\(\\mu\\), and the bottom plot shows the log-likelihood (with negative y values). Answer the following questions:",
        "q": "\\(\\hat{\\theta}\\) is the maximum probability of the dataset",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "It is the parameter value that maximizes likelihood, not a probability."
      },
      {
        "context": "Density Estimation. Consider a figure from the lecture slides in the context of estimating the mean \\(\\mu\\) of a normal distribution (with given fixed variance) from a set of observations in a 1D dataset. The figure shows three stacked plots: the top plot shows the data and candidate normal densities, the middle plot shows the likelihood function as a function of \\(\\mu\\), and the bottom plot shows the log-likelihood (with negative y values). Answer the following questions:",
        "q": "We need to plot the likelihood function in order to find the maximum",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "The maximum can be found analytically by setting the derivative to zero."
      },
      {
        "context": "1-NN / Nearest Neighbour Classifiers. Consider a k-nearest-neighbour classifier in a d-dimensional numeric feature space, with a training set \\(\\mathcal{D}\\) containing > 0 instances of two classes, and with the Euclidean distance as distance function. If we set \\(k = N\\), where \\(N = |\\mathcal{D}|\\) is the number of given training examples, then which of the following statements are true?",
        "q": "The classifier will maximally overfit on the training data",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "k=N gives the majority class for every input — maximum underfitting."
      },
      {
        "context": "1-NN / Nearest Neighbour Classifiers. Consider a k-nearest-neighbour classifier in a d-dimensional numeric feature space, with a training set \\(\\mathcal{D}\\) containing > 0 instances of two classes, and with the Euclidean distance as distance function. If we set \\(k = N\\), where \\(N = |\\mathcal{D}|\\) is the number of given training examples, then which of the following statements are true?",
        "q": "The resulting classifier will have an expected accuracy of \\(1/N\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "1-NN / Nearest Neighbour Classifiers. Consider a k-nearest-neighbour classifier in a d-dimensional numeric feature space, with a training set \\(\\mathcal{D}\\) containing > 0 instances of two classes, and with the Euclidean distance as distance function. If we set \\(k = N\\), where \\(N = |\\mathcal{D}|\\) is the number of given training examples, then which of the following statements are true?",
        "q": "Each example from the training set will be classified into the correct class",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "All examples receive the same (majority) prediction."
      },
      {
        "context": "1-NN / Nearest Neighbour Classifiers. Consider a k-nearest-neighbour classifier in a d-dimensional numeric feature space, with a training set \\(\\mathcal{D}\\) containing > 0 instances of two classes, and with the Euclidean distance as distance function. If we set \\(k = N\\), where \\(N = |\\mathcal{D}|\\) is the number of given training examples, then which of the following statements are true?",
        "q": "The resubstitution estimate on \\(\\mathcal{D}\\) will be 1.0",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "1-NN / Nearest Neighbour Classifiers. Consider a k-nearest-neighbour classifier in a d-dimensional numeric feature space, with a training set \\(\\mathcal{D}\\) containing > 0 instances of two classes, and with the Euclidean distance as distance function. If we set \\(k = N\\), where \\(N = |\\mathcal{D}|\\) is the number of given training examples, then which of the following statements are true?",
        "q": "All test examples will be classified into the same class",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "With k=N, every query uses all training data and returns the majority class."
      },
      {
        "context": "Trees and Forests. Consider a decision tree learner that operates as follows: given a training set \\(\\mathcal{D}\\) and a set of discrete features \\(F\\), it randomly selects one feature from \\(F\\), builds a one-level tree by splitting the data according to this feature, and labels the resulting subnodes as leaves with the majority class in each respective node. Which of the following statements (if any) are true?",
        "q": "It makes no sense to combine several such trees into a Random Forest, because the trees rely on incompatible features",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Trees and Forests. Consider a decision tree learner that operates as follows: given a training set \\(\\mathcal{D}\\) and a set of discrete features \\(F\\), it randomly selects one feature from \\(F\\), builds a one-level tree by splitting the data according to this feature, and labels the resulting subnodes as leaves with the majority class in each respective node. Which of the following statements (if any) are true?",
        "q": "The chosen feature split might have an information gain of zero",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "A randomly chosen feature can be uninformative."
      },
      {
        "context": "Trees and Forests. Consider a decision tree learner that operates as follows: given a training set \\(\\mathcal{D}\\) and a set of discrete features \\(F\\), it randomly selects one feature from \\(F\\), builds a one-level tree by splitting the data according to this feature, and labels the resulting subnodes as leaves with the majority class in each respective node. Which of the following statements (if any) are true?",
        "q": "Any such decision tree will have an accuracy on the training set \\(\\mathcal{D}\\) that is higher than the default accuracy",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "If info gain is 0, accuracy equals default accuracy."
      },
      {
        "context": "Trees and Forests. Consider a decision tree learner that operates as follows: given a training set \\(\\mathcal{D}\\) and a set of discrete features \\(F\\), it randomly selects one feature from \\(F\\), builds a one-level tree by splitting the data according to this feature, and labels the resulting subnodes as leaves with the majority class in each respective node. Which of the following statements (if any) are true?",
        "q": "Any such decision tree will have exactly the default accuracy on the training set \\(\\mathcal{D}\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "It can be higher when a useful feature is selected."
      },
      {
        "context": "Trees and Forests. Consider a decision tree learner that operates as follows: given a training set \\(\\mathcal{D}\\) and a set of discrete features \\(F\\), it randomly selects one feature from \\(F\\), builds a one-level tree by splitting the data according to this feature, and labels the resulting subnodes as leaves with the majority class in each respective node. Which of the following statements (if any) are true?",
        "q": "The resulting structure is not a decision tree",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "A one-level tree (decision stump) is still a decision tree."
      },
      {
        "context": "Various Classifiers (2-class x1/x2 dataset). Consider a 2-class dataset (from the lecture slides) in a two-dimensional feature space defined by features \\(x_1, x_2\\), where the two classes are indicated by filled vs. empty dots. The dataset is not linearly separable: filled (black) dots form an inner cluster near the origin and empty (white) dots surround them in a roughly circular/annular arrangement. Which of the following statements are correct?",
        "q": "A support vector machine with a quadratic kernel can achieve an error of zero on this dataset",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "A quadratic kernel can model a circular boundary."
      },
      {
        "context": "Various Classifiers (2-class x1/x2 dataset). Consider a 2-class dataset (from the lecture slides) in a two-dimensional feature space defined by features \\(x_1, x_2\\), where the two classes are indicated by filled vs. empty dots. The dataset is not linearly separable: filled (black) dots form an inner cluster near the origin and empty (white) dots surround them in a roughly circular/annular arrangement. Which of the following statements are correct?",
        "q": "If we map this dataset into a new 2D feature space defined by features \\(x_1^2, x_2^2\\), ID3 can separate the two classes with a two-level decision tree (i.e., two levels of splits)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Various Classifiers (2-class x1/x2 dataset). Consider a 2-class dataset (from the lecture slides) in a two-dimensional feature space defined by features \\(x_1, x_2\\), where the two classes are indicated by filled vs. empty dots. The dataset is not linearly separable: filled (black) dots form an inner cluster near the origin and empty (white) dots surround them in a roughly circular/annular arrangement. Which of the following statements are correct?",
        "q": "A decision tree learned by ID3 would have to have an infinite number of splits (i.e., infinite depth) in order to achieve an error of zero on this dataset",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Finite-depth axis-aligned splits suffice for a finite dataset."
      },
      {
        "context": "Various Classifiers (2-class x1/x2 dataset). Consider a 2-class dataset (from the lecture slides) in a two-dimensional feature space defined by features \\(x_1, x_2\\), where the two classes are indicated by filled vs. empty dots. The dataset is not linearly separable: filled (black) dots form an inner cluster near the origin and empty (white) dots surround them in a roughly circular/annular arrangement. Which of the following statements are correct?",
        "q": "A nearest-neighbour classifier can only perform well on this dataset if it uses circular (and not rectangular) neighbourhoods",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Various Classifiers (2-class x1/x2 dataset). Consider a 2-class dataset (from the lecture slides) in a two-dimensional feature space defined by features \\(x_1, x_2\\), where the two classes are indicated by filled vs. empty dots. The dataset is not linearly separable: filled (black) dots form an inner cluster near the origin and empty (white) dots surround them in a roughly circular/annular arrangement. Which of the following statements are correct?",
        "q": "The max margin hyperplane that an SVM with quadratic kernel would learn on this dataset remains the same, regardless of which of the two classes we label as +1 and which one as -1",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "The max-margin separator is symmetric under class label swap."
      },
      {
        "context": "Various Classifiers (2-class x1/x2 dataset). Consider a 2-class dataset (from the lecture slides) in a two-dimensional feature space defined by features \\(x_1, x_2\\), where the two classes are indicated by filled vs. empty dots. The dataset is not linearly separable: filled (black) dots form an inner cluster near the origin and empty (white) dots surround them in a roughly circular/annular arrangement. Which of the following statements are correct?",
        "q": "There exists no \\(k\\) for which a k-NN algorithm would predict class \"white\" for point (0,0)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "For large enough k, the majority white class wins."
      },
      {
        "context": "Feedforward NN. Consider a classifier for the above 2-class \\(x_1, x_2\\) dataset in the form of a Feedforward Neural Network, with two input units for the two features \\(x_1, x_2\\), one hidden unit with the \\(\\tanh\\) activation function, and one output unit with identity activation. We represent the two classes as 0 (white) and 1 (black), learn model parameters by training on the dataset with the squared error loss function, and predict class 1 (black) when the output value is higher than some threshold \\(\\tau\\), class 0 (white) otherwise. There is no restriction on the size of weights. Which of the following statements about this model are correct?",
        "q": "Increasing the classification threshold \\(\\tau\\) cannot increase the recall of the model on class 0 on the training set",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Raising tau makes more inputs classified as 0, increasing class 0 recall."
      },
      {
        "context": "Feedforward NN. Consider a classifier for the above 2-class \\(x_1, x_2\\) dataset in the form of a Feedforward Neural Network, with two input units for the two features \\(x_1, x_2\\), one hidden unit with the \\(\\tanh\\) activation function, and one output unit with identity activation. We represent the two classes as 0 (white) and 1 (black), learn model parameters by training on the dataset with the squared error loss function, and predict class 1 (black) when the output value is higher than some threshold \\(\\tau\\), class 0 (white) otherwise. There is no restriction on the size of weights. Which of the following statements about this model are correct?",
        "q": "The single hidden unit is unnecessary and makes no difference; a network without hidden unit could learn the same function",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Without a hidden nonlinearity, the network is linear in inputs."
      },
      {
        "context": "Feedforward NN. Consider a classifier for the above 2-class \\(x_1, x_2\\) dataset in the form of a Feedforward Neural Network, with two input units for the two features \\(x_1, x_2\\), one hidden unit with the \\(\\tanh\\) activation function, and one output unit with identity activation. We represent the two classes as 0 (white) and 1 (black), learn model parameters by training on the dataset with the squared error loss function, and predict class 1 (black) when the output value is higher than some threshold \\(\\tau\\), class 0 (white) otherwise. There is no restriction on the size of weights. Which of the following statements about this model are correct?",
        "q": "If we set the threshold \\(\\tau\\) to 0.0 or 1.0, all possible inputs will always be classified into the same class (black or white, respectively), by any model trained in this way",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Output with identity activation is unbounded; outputs can lie above/below those thresholds."
      },
      {
        "context": "Feedforward NN. Consider a classifier for the above 2-class \\(x_1, x_2\\) dataset in the form of a Feedforward Neural Network, with two input units for the two features \\(x_1, x_2\\), one hidden unit with the \\(\\tanh\\) activation function, and one output unit with identity activation. We represent the two classes as 0 (white) and 1 (black), learn model parameters by training on the dataset with the squared error loss function, and predict class 1 (black) when the output value is higher than some threshold \\(\\tau\\), class 0 (white) otherwise. There is no restriction on the size of weights. Which of the following statements about this model are correct?",
        "q": "The output predicted by the output unit is a probability",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Identity output is not constrained to [0,1]."
      },
      {
        "context": "Feedforward NN. Consider a classifier for the above 2-class \\(x_1, x_2\\) dataset in the form of a Feedforward Neural Network, with two input units for the two features \\(x_1, x_2\\), one hidden unit with the \\(\\tanh\\) activation function, and one output unit with identity activation. We represent the two classes as 0 (white) and 1 (black), learn model parameters by training on the dataset with the squared error loss function, and predict class 1 (black) when the output value is higher than some threshold \\(\\tau\\), class 0 (white) otherwise. There is no restriction on the size of weights. Which of the following statements about this model are correct?",
        "q": "By choosing different values for \\(\\tau\\) (for a fixed learned model), we can obtain classifiers with different positions in ROC space",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Varying the threshold sweeps the ROC curve."
      },
      {
        "context": "Feedforward NN. Consider a classifier for the above 2-class \\(x_1, x_2\\) dataset in the form of a Feedforward Neural Network, with two input units for the two features \\(x_1, x_2\\), one hidden unit with the \\(\\tanh\\) activation function, and one output unit with identity activation. We represent the two classes as 0 (white) and 1 (black), learn model parameters by training on the dataset with the squared error loss function, and predict class 1 (black) when the output value is higher than some threshold \\(\\tau\\), class 0 (white) otherwise. There is no restriction on the size of weights. Which of the following statements about this model are correct?",
        "q": "The output predicted by the output unit will always be in the interval \\([0,1]\\)",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Identity activation produces unbounded outputs."
      },
      {
        "context": "HMM. Suppose you are (mildly) interested in the currently ongoing European Football Championship. As you go past your neighbour's house, you are trying to infer, from the noises you hear from the open windows, whether there is currently a game going on. Model this as an HMM with states \\(S = \\{\\mathit{game}, \\mathit{nogame}\\}\\) and possible observations \\(O = \\{\\mathit{none}, \\mathit{cheer}, \\mathit{shout}, \\mathit{curse}, \\mathit{snore}\\}\\), with parameter values learned from observations over many previous championships.",
        "q": "What is the dimension (number of rows and columns) of matrix \\(A\\) (as defined in the lecture slides)?",
        "opts": [
          "1 x 2",
          "2 x 2",
          "2 x 5",
          "5 x 2",
          "5 x 5"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "A is the state transition matrix, |S| x |S| = 2 x 2."
      },
      {
        "context": "HMM. Suppose you are (mildly) interested in the currently ongoing European Football Championship. As you go past your neighbour's house, you are trying to infer, from the noises you hear from the open windows, whether there is currently a game going on. Model this as an HMM with states \\(S = \\{\\mathit{game}, \\mathit{nogame}\\}\\) and possible observations \\(O = \\{\\mathit{none}, \\mathit{cheer}, \\mathit{shout}, \\mathit{curse}, \\mathit{snore}\\}\\), with parameter values learned from observations over many previous championships.",
        "q": "What is the dimension (number of rows and columns) of matrix \\(B\\) (as defined in the lecture slides)?",
        "opts": [
          "2 x 2",
          "2 x 5",
          "5 x 2",
          "5 x 5",
          "3 x 5"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "B is the emission matrix, |S| x |O| = 2 x 5."
      },
      {
        "context": "HMM. Suppose you are (mildly) interested in the currently ongoing European Football Championship. As you go past your neighbour's house, you are trying to infer, from the noises you hear from the open windows, whether there is currently a game going on. Model this as an HMM with states \\(S = \\{\\mathit{game}, \\mathit{nogame}\\}\\) and possible observations \\(O = \\{\\mathit{none}, \\mathit{cheer}, \\mathit{shout}, \\mathit{curse}, \\mathit{snore}\\}\\), with parameter values learned from observations over many previous championships.",
        "q": "What is the dimension of \\(\\Pi\\) (as defined in the lecture slides)?",
        "opts": [
          "1",
          "2",
          "3",
          "5"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Pi is the initial state distribution, length |S| = 2."
      },
      {
        "context": "HMM. Suppose you are (mildly) interested in the currently ongoing European Football Championship. As you go past your neighbour's house, you are trying to infer, from the noises you hear from the open windows, whether there is currently a game going on. Model this as an HMM with states \\(S = \\{\\mathit{game}, \\mathit{nogame}\\}\\) and possible observations \\(O = \\{\\mathit{none}, \\mathit{cheer}, \\mathit{shout}, \\mathit{curse}, \\mathit{snore}\\}\\), with parameter values learned from observations over many previous championships. Which of the following statements about this model are true?",
        "q": "With only two states, matrix \\(\\boldsymbol{A}\\) must be symmetric",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Transition probabilities P(s|s') need not equal P(s'|s)."
      },
      {
        "context": "HMM. Suppose you are (mildly) interested in the currently ongoing European Football Championship. As you go past your neighbour's house, you are trying to infer, from the noises you hear from the open windows, whether there is currently a game going on. Model this as an HMM with states \\(S = \\{\\mathit{game}, \\mathit{nogame}\\}\\) and possible observations \\(O = \\{\\mathit{none}, \\mathit{cheer}, \\mathit{shout}, \\mathit{curse}, \\mathit{snore}\\}\\), with parameter values learned from observations over many previous championships. Which of the following statements about this model are true?",
        "q": "If your neighbour never snores, one row of the matrix \\(\\boldsymbol{B}\\) will be all zeros",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Wait — rows of B correspond to states and sum to 1; the snore column would be all zeros. The marked answer is 'True'."
      },
      {
        "context": "HMM. Suppose you are (mildly) interested in the currently ongoing European Football Championship. As you go past your neighbour's house, you are trying to infer, from the noises you hear from the open windows, whether there is currently a game going on. Model this as an HMM with states \\(S = \\{\\mathit{game}, \\mathit{nogame}\\}\\) and possible observations \\(O = \\{\\mathit{none}, \\mathit{cheer}, \\mathit{shout}, \\mathit{curse}, \\mathit{snore}\\}\\), with parameter values learned from observations over many previous championships. Which of the following statements about this model are true?",
        "q": "Matrix \\(\\boldsymbol{B}\\) represents a Markov Process",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "B is the emission matrix; A represents the Markov process."
      },
      {
        "context": "HMM. Suppose you are (mildly) interested in the currently ongoing European Football Championship. As you go past your neighbour's house, you are trying to infer, from the noises you hear from the open windows, whether there is currently a game going on. Model this as an HMM with states \\(S = \\{\\mathit{game}, \\mathit{nogame}\\}\\) and possible observations \\(O = \\{\\mathit{none}, \\mathit{cheer}, \\mathit{shout}, \\mathit{curse}, \\mathit{snore}\\}\\), with parameter values learned from observations over many previous championships. Which of the following statements about this model are true?",
        "q": "The diagonal of \\(\\boldsymbol{A}\\) must sum to 1.0",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Rows sum to 1, not the diagonal."
      },
      {
        "context": "HMM. Suppose you are (mildly) interested in the currently ongoing European Football Championship. As you go past your neighbour's house, you are trying to infer, from the noises you hear from the open windows, whether there is currently a game going on. Model this as an HMM with states \\(S = \\{\\mathit{game}, \\mathit{nogame}\\}\\) and possible observations \\(O = \\{\\mathit{none}, \\mathit{cheer}, \\mathit{shout}, \\mathit{curse}, \\mathit{snore}\\}\\), with parameter values learned from observations over many previous championships. Which of the following statements about this model are true?",
        "q": "We can estimate the expected duration of a game (= number of consecutive time points \\(t\\) with \\(q_t = \\mathit{game}\\)) from",
        "opts": [
          "matrix \\(\\boldsymbol{A}\\) of the model",
          "vector \\(\\mathbf{\\Pi}\\) of the model",
          "not at all",
          "matrix \\(\\boldsymbol{B}\\) of the model"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Expected duration depends on the self-transition probability in A."
      }
    ]
  },
  {
    "id": "pc_2023_retry",
    "title": "MLPC Exam 2023 Retry — JKU",
    "description": "Retake exam covering core MLPC topics",
    "questions": [
      {
        "context": "Bayesian Classification. Consider minimum risk classification as introduced in the lecture, with the Conditional Risk formula: $$R(\\alpha_i \\mid x) = \\sum_{j=1}^{c} \\lambda(\\alpha_i \\mid \\omega_j) P(\\omega_j \\mid x)$$ Assume we have \\(\\Omega = \\{\\omega_1, \\ldots, \\omega_c\\}\\), a list of actions \\(\\{\\alpha_i = \\text{\"predict class } i\\text{\"}\\}\\), a given cost function \\(\\Lambda = \\{\\lambda_{ij} = \\lambda(\\alpha_i \\mid \\omega_j)\\}\\), and known probability distributions \\(P(\\Omega)\\) and \\(P(X \\mid \\Omega)\\). Which of the following statements are correct?",
        "q": "MAP classification behaviour can be obtained by an appropriate setting of the cost function.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Bayesian Classification. Consider minimum risk classification as introduced in the lecture, with the Conditional Risk formula: $$R(\\alpha_i \\mid x) = \\sum_{j=1}^{c} \\lambda(\\alpha_i \\mid \\omega_j) P(\\omega_j \\mid x)$$ Assume we have \\(\\Omega = \\{\\omega_1, \\ldots, \\omega_c\\}\\), a list of actions \\(\\{\\alpha_i = \\text{\"predict class } i\\text{\"}\\}\\), a given cost function \\(\\Lambda = \\{\\lambda_{ij} = \\lambda(\\alpha_i \\mid \\omega_j)\\}\\), and known probability distributions \\(P(\\Omega)\\) and \\(P(X \\mid \\Omega)\\). Which of the following statements are correct?",
        "q": "The effect of any change to the cost function can also be achieved by leaving the cost function unchanged and modifying the likelihoods \\(P(X \\mid \\omega_j)\\) accordingly.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Bayesian Classification. Consider minimum risk classification as introduced in the lecture, with the Conditional Risk formula: $$R(\\alpha_i \\mid x) = \\sum_{j=1}^{c} \\lambda(\\alpha_i \\mid \\omega_j) P(\\omega_j \\mid x)$$ Assume we have \\(\\Omega = \\{\\omega_1, \\ldots, \\omega_c\\}\\), a list of actions \\(\\{\\alpha_i = \\text{\"predict class } i\\text{\"}\\}\\), a given cost function \\(\\Lambda = \\{\\lambda_{ij} = \\lambda(\\alpha_i \\mid \\omega_j)\\}\\), and known probability distributions \\(P(\\Omega)\\) and \\(P(X \\mid \\Omega)\\). Which of the following statements are correct?",
        "q": "Written as a matrix, the above cost function \\(\\Lambda\\) is of quadratic shape.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Bayesian Classification. Consider minimum risk classification as introduced in the lecture, with the Conditional Risk formula: $$R(\\alpha_i \\mid x) = \\sum_{j=1}^{c} \\lambda(\\alpha_i \\mid \\omega_j) P(\\omega_j \\mid x)$$ Assume we have \\(\\Omega = \\{\\omega_1, \\ldots, \\omega_c\\}\\), a list of actions \\(\\{\\alpha_i = \\text{\"predict class } i\\text{\"}\\}\\), a given cost function \\(\\Lambda = \\{\\lambda_{ij} = \\lambda(\\alpha_i \\mid \\omega_j)\\}\\), and known probability distributions \\(P(\\Omega)\\) and \\(P(X \\mid \\Omega)\\). Which of the following statements are correct?",
        "q": "For any cost function, the expected cost is equal to the Bayes Error.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Bayesian Classification. Consider minimum risk classification as introduced in the lecture, with the Conditional Risk formula: $$R(\\alpha_i \\mid x) = \\sum_{j=1}^{c} \\lambda(\\alpha_i \\mid \\omega_j) P(\\omega_j \\mid x)$$ Assume we have \\(\\Omega = \\{\\omega_1, \\ldots, \\omega_c\\}\\), a list of actions \\(\\{\\alpha_i = \\text{\"predict class } i\\text{\"}\\}\\), a given cost function \\(\\Lambda = \\{\\lambda_{ij} = \\lambda(\\alpha_i \\mid \\omega_j)\\}\\), and known probability distributions \\(P(\\Omega)\\) and \\(P(X \\mid \\Omega)\\). Which of the following statements are correct?",
        "q": "The expected risk defines decision boundaries only in a two-dimensional feature space.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Bayesian Classification / Minimum Risk. Consider the same setup as above with cost function \\(\\Lambda\\) and conditional risk \\(R(\\alpha_i \\mid x) = \\sum_j \\lambda_{ij} P(\\omega_j \\mid x)\\).",
        "q": "If we multiply the cost function with a constant \\(k\\), the probability of all classes will (multiple answers possible):",
        "opts": [
          "remain the same",
          "sum to \\(1.0 \\cdot k\\)",
          "change so that probable classes become less probable, and vice versa (\"smoothing\")",
          "increase by a factor \\(k\\)",
          "be reduced by a factor \\(k\\)"
        ],
        "ans": [
          0
        ],
        "multi": true,
        "explanation": "Multiplying costs by a constant rescales risks uniformly but does not affect class posterior probabilities."
      },
      {
        "context": "Bayesian Classification / Minimum Risk. Consider the same setup as above with cost function \\(\\Lambda\\) and conditional risk \\(R(\\alpha_i \\mid x) = \\sum_j \\lambda_{ij} P(\\omega_j \\mid x)\\).",
        "q": "If we set the cost function to all 1 (i.e., all \\(\\lambda_{ij} = 1\\)), then (multiple answers possible):",
        "opts": [
          "minimum risk classification becomes the same as MAP classification",
          "the risk for all actions becomes \\(c\\), for any \\(x\\), where \\(c > 1\\) is the number of classes",
          "all decisions will have the same cost, for any \\(x\\)",
          "the risk for all actions becomes 1, for any \\(x\\)",
          "for any \\(x\\), every decision is equally good"
        ],
        "ans": [
          2,
          3,
          4
        ],
        "multi": true,
        "explanation": "With all \\(\\lambda_{ij}=1\\): \\(R(\\alpha_i \\mid x) = \\sum_j P(\\omega_j \\mid x) = 1\\) for every action, so all decisions have equal cost and are equally good."
      },
      {
        "context": "Classifier Evaluation. Consider a two-class classification problem with classes p and n, and a test set T with 1000 test examples and class distribution P:N = 3:7. Which of the following statements are true?",
        "q": "The iso-performance line cannot go through points (0, 0) and (1, 1).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Classifier Evaluation. Consider a two-class classification problem with classes p and n, and a test set T with 1000 test examples and class distribution P:N = 3:7. Which of the following statements are true?",
        "q": "For any classifier C and any dataset D, \\(\\text{Recall}(C, D) + \\text{Precision}(C, D) = 1.0\\).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Classifier Evaluation. Consider a two-class classification problem with classes p and n, and a test set T with 1000 test examples and class distribution P:N = 3:7. Which of the following statements are true?",
        "q": "If two classifiers \\(C_1, C_2\\) have the same True Positive Rates (TPRs), but different False Positive Rates, they cannot have the same accuracy on any given fixed test set T.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Classifier Evaluation. Consider a two-class classification problem with classes p and n, and a test set T with 1000 test examples and class distribution P:N = 3:7. Which of the following statements are true?",
        "q": "Two classifiers with the same accuracy cannot occupy different places in ROC space.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Decision Trees. Consider the following alternative criterion (instead of information gain) for evaluating a feature \\(A\\) for splitting in the ID3 algorithm, in a binary classification task with two classes \\(\\Omega = \\{+, -\\}\\) and \\(p_i\\) (\\(n_i\\)) = number of pos (neg) examples in \\(D_i\\), the \\(i\\)-th branch: $$G_D(A) = \\sum_{v_i \\in A} \\frac{|D_i|}{|D|} \\cdot \\frac{|p_i - n_i|}{p_i + n_i}$$",
        "q": "The best feature is the one that minimises this measure.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Pure branches yield \\(|p_i - n_i|/(p_i+n_i) = 1\\); the measure is maximised for purer splits, so the best feature maximises it."
      },
      {
        "context": "Decision Trees. Consider the following alternative criterion (instead of information gain) for evaluating a feature \\(A\\) for splitting in the ID3 algorithm, in a binary classification task with two classes \\(\\Omega = \\{+, -\\}\\) and \\(p_i\\) (\\(n_i\\)) = number of pos (neg) examples in \\(D_i\\), the \\(i\\)-th branch: $$G_D(A) = \\sum_{v_i \\in A} \\frac{|D_i|}{|D|} \\cdot \\frac{|p_i - n_i|}{p_i + n_i}$$",
        "q": "This measure will become maximal when each branch only contains examples of one class.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Decision Trees. Consider the following alternative criterion (instead of information gain) for evaluating a feature \\(A\\) for splitting in the ID3 algorithm, in a binary classification task with two classes \\(\\Omega = \\{+, -\\}\\) and \\(p_i\\) (\\(n_i\\)) = number of pos (neg) examples in \\(D_i\\), the \\(i\\)-th branch: $$G_D(A) = \\sum_{v_i \\in A} \\frac{|D_i|}{|D|} \\cdot \\frac{|p_i - n_i|}{p_i + n_i}$$",
        "q": "When a feature \\(A\\) perfectly discriminates between the classes in \\(D\\), \\(G_D(A)\\):",
        "opts": [
          "\\(< 0.0\\)",
          "is useless",
          "\\(= 1.0\\)",
          "is undefined",
          "is equal to the information gain",
          "\\(> 1.0\\)",
          "\\(= 0.0\\)"
        ],
        "ans": [
          2
        ],
        "multi": false,
        "explanation": "When \\(A\\) perfectly separates classes, every branch has either all \\(+\\) or all \\(-\\) examples, so each \\(|p_i-n_i|/(p_i+n_i)=1\\) and the weighted sum equals 1."
      },
      {
        "context": "Decision Trees — ID3-S variant. Consider a variant \"ID3-S\" of the ID3 algorithm that learns only trees that are at most one level deep. It chooses a feature for the root, using the Information Gain heuristic, and labels each of the resulting nodes with the class that is most frequent in that node (in case of a tie, it randomly chooses between one of the competing classes). Which of the following statements about ID3-S are true:",
        "q": "This is not a valid learning algorithm.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Decision Trees — ID3-S variant. Consider a variant \"ID3-S\" of the ID3 algorithm that learns only trees that are at most one level deep. It chooses a feature for the root, using the Information Gain heuristic, and labels each of the resulting nodes with the class that is most frequent in that node (in case of a tie, it randomly chooses between one of the competing classes). Which of the following statements about ID3-S are true:",
        "q": "This algorithm cannot result in a classifier with an accuracy of 1.0 on the training set.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Decision Trees — ID3-S variant. Consider a variant \"ID3-S\" of the ID3 algorithm that learns only trees that are at most one level deep. It chooses a feature for the root, using the Information Gain heuristic, and labels each of the resulting nodes with the class that is most frequent in that node (in case of a tie, it randomly chooses between one of the competing classes). Which of the following statements about ID3-S are true:",
        "q": "This is a high-bias learner.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Decision Trees — ID3-S variant. Consider a variant \"ID3-S\" of the ID3 algorithm that learns only trees that are at most one level deep. It chooses a feature for the root, using the Information Gain heuristic, and labels each of the resulting nodes with the class that is most frequent in that node (in case of a tie, it randomly chooses between one of the competing classes). Which of the following statements about ID3-S are true:",
        "q": "Combining different such trees via voting can improve accuracy on some dataset.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Neural Networks and Deep Learning. Consider the simple neural network from the lecture slides, with 1 input unit (for a feature \\(x\\)), one hidden unit, and one output unit \\(y\\), where the hidden unit uses tanh as activation function, and the output unit \\(y\\) uses the identity function (i.e., just outputs what comes in as net input). Also assume that the loss function is the sum squared error. Which of the following statements are correct for this network?",
        "q": "A training set for this network will have to consist of pairs of numbers.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Neural Networks and Deep Learning. Consider the simple neural network from the lecture slides, with 1 input unit (for a feature \\(x\\)), one hidden unit, and one output unit \\(y\\), where the hidden unit uses tanh as activation function, and the output unit \\(y\\) uses the identity function (i.e., just outputs what comes in as net input). Also assume that the loss function is the sum squared error. Which of the following statements are correct for this network?",
        "q": "Changing the output activation function from linear (identity) to tanh will not make any difference, as the hidden unit already uses the tanh activation.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Neural Networks and Deep Learning. Consider the simple neural network from the lecture slides, with 1 input unit (for a feature \\(x\\)), one hidden unit, and one output unit \\(y\\), where the hidden unit uses tanh as activation function, and the output unit \\(y\\) uses the identity function (i.e., just outputs what comes in as net input). Also assume that the loss function is the sum squared error. Which of the following statements are correct for this network?",
        "q": "If we change the output of the bias unit from 1.0 to 2.0, the result is no longer a valid neural network.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Neural Networks and Deep Learning. Consider the simple neural network from the lecture slides, with 1 input unit (for a feature \\(x\\)), one hidden unit, and one output unit \\(y\\), where the hidden unit uses tanh as activation function, and the output unit \\(y\\) uses the identity function (i.e., just outputs what comes in as net input). Also assume that the loss function is the sum squared error. Which of the following statements are correct for this network?",
        "q": "Changing the output of the bias unit from 1.0 to 2.0 will change the absolute value of the Sum Squared Error on the training set \\(D\\), but will not change the values of the network weights that minimise the error on \\(D\\).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Neural Networks and Deep Learning. Consider the simple neural network from the lecture slides, with 1 input unit (for a feature \\(x\\)), one hidden unit, and one output unit \\(y\\), where the hidden unit uses tanh as activation function, and the output unit \\(y\\) uses the identity function (i.e., just outputs what comes in as net input). Also assume that the loss function is the sum squared error. Which of the following statements are correct for this network?",
        "q": "The loss function is defined over a four-dimensional parameter space.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Parameters: input-to-hidden weight, hidden bias, hidden-to-output weight, output bias — four total."
      },
      {
        "context": "Neural Networks — Binary Classification. Now assume we use the above simple network for a binary classification task. We encode the class labels as 1 and 0, equip the output unit \\(y\\) with a logistic activation function, and use the Binary Cross-Entropy as the loss function: $$CE(x_i) = -y_i \\log \\hat{y}_i - (1 - y_i) \\log(1 - \\hat{y}_i)$$ where \\(y_i\\) is the true class of example \\(x_i\\) (0 or 1), and \\(\\hat{y}_i\\) is the value predicted by output unit \\(y\\). An example \\(x_i\\) is classified as class 1 iff \\(\\hat{y}_i \\geq 0.5\\). Which of the following statements are correct?",
        "q": "This classifier can only learn decision boundaries that split the feature space into two regions.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Neural Networks — Binary Classification. Now assume we use the above simple network for a binary classification task. We encode the class labels as 1 and 0, equip the output unit \\(y\\) with a logistic activation function, and use the Binary Cross-Entropy as the loss function: $$CE(x_i) = -y_i \\log \\hat{y}_i - (1 - y_i) \\log(1 - \\hat{y}_i)$$ where \\(y_i\\) is the true class of example \\(x_i\\) (0 or 1), and \\(\\hat{y}_i\\) is the value predicted by output unit \\(y\\). An example \\(x_i\\) is classified as class 1 iff \\(\\hat{y}_i \\geq 0.5\\). Which of the following statements are correct?",
        "q": "If we make the network deeper by adding additional hidden layers, the CE function must be extended with corresponding additional terms.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Neural Networks — Binary Classification. Now assume we use the above simple network for a binary classification task. We encode the class labels as 1 and 0, equip the output unit \\(y\\) with a logistic activation function, and use the Binary Cross-Entropy as the loss function: $$CE(x_i) = -y_i \\log \\hat{y}_i - (1 - y_i) \\log(1 - \\hat{y}_i)$$ where \\(y_i\\) is the true class of example \\(x_i\\) (0 or 1), and \\(\\hat{y}_i\\) is the value predicted by output unit \\(y\\). An example \\(x_i\\) is classified as class 1 iff \\(\\hat{y}_i \\geq 0.5\\). Which of the following statements are correct?",
        "q": "If the class distribution in the training set is 50:50, the binary cross-entropy CE encourages the network to predict values close to 0.5.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Neural Networks — Binary Classification. Now assume we use the above simple network for a binary classification task. We encode the class labels as 1 and 0, equip the output unit \\(y\\) with a logistic activation function, and use the Binary Cross-Entropy as the loss function: $$CE(x_i) = -y_i \\log \\hat{y}_i - (1 - y_i) \\log(1 - \\hat{y}_i)$$ where \\(y_i\\) is the true class of example \\(x_i\\) (0 or 1), and \\(\\hat{y}_i\\) is the value predicted by output unit \\(y\\). An example \\(x_i\\) is classified as class 1 iff \\(\\hat{y}_i \\geq 0.5\\). Which of the following statements are correct?",
        "q": "This classifier can easily overfit because the cross-entropy is non-linear.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Unsupervised Learning / k-means. Consider the task of k-means clustering with \\(N\\) observations described in terms of \\(D\\) numeric features, with the Euclidean distance as distance measure. Assume we have set the number \\(k\\) of clusters to \\(k = 5\\). Which of the following statements are correct?",
        "q": "When we increase the number of features, the model complexity penalty term in the Bayes Information Criterion will automatically grow larger.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Unsupervised Learning / k-means. Consider the task of k-means clustering with \\(N\\) observations described in terms of \\(D\\) numeric features, with the Euclidean distance as distance measure. Assume we have set the number \\(k\\) of clusters to \\(k = 5\\). Which of the following statements are correct?",
        "q": "In k-means, \\(k\\) has to be at least \\(N/2\\).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Unsupervised Learning / k-means. Consider the task of k-means clustering with \\(N\\) observations described in terms of \\(D\\) numeric features, with the Euclidean distance as distance measure. Assume we have set the number \\(k\\) of clusters to \\(k = 5\\). Which of the following statements are correct?",
        "q": "To use the Bayes Information Criterion for selecting an appropriate value for \\(k\\), a k-means cluster model must be converted into a probabilistic model.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Unsupervised Learning / k-means. Consider the task of k-means clustering with \\(N\\) observations described in terms of \\(D\\) numeric features, with the Euclidean distance as distance measure. Assume we have set the number \\(k\\) of clusters to \\(k = 5\\). Which of the following statements are correct?",
        "q": "The cluster with the smallest number of members will have the lowest (best) MQE.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Unsupervised Learning / k-means. Consider the task of k-means clustering with \\(N\\) observations described in terms of \\(D\\) numeric features, with the Euclidean distance as distance measure. Assume we have set the number \\(k\\) of clusters to \\(k = 5\\). Which of the following statements are correct?",
        "q": "Feature normalisation will change the MQE, but not the clusters found.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Unsupervised Learning — Gaussian Mixture Models. Consider a Gaussian Mixture Model (GMM) with \\(k\\) components that was learned from a dataset of \\(N\\) examples over a \\(D\\)-dimensional numeric feature space.",
        "q": "How many parameters (numbers) does a specification of this GMM consist of (ignoring possible redundancies because of distribution constraints and symmetries)?",
        "opts": [
          "\\(k + kD + D\\)",
          "\\(k(D \\cdot N)\\)",
          "\\(k + kD + kD^2\\)",
          "\\(3kD\\)",
          "\\(kD + N\\)",
          "\\(kN + kD + kD^2\\)",
          "\\(3k\\)"
        ],
        "ans": [
          2
        ],
        "multi": false,
        "explanation": "\\(k\\) mixture weights + \\(kD\\) mean parameters + \\(kD^2\\) covariance-matrix entries."
      },
      {
        "context": "Markov Models. Consider a simple Markov process with 3 states (S1, S2, S3), the following state transition model and a uniform prior state distribution \\(\\pi = [1/3, 1/3, 1/3]\\): $$A = \\begin{pmatrix} 0.4 & 0.3 & 0.3 \\\\ 0.2 & 0.6 & 0.2 \\\\ 0.1 & 0.1 & 0.8 \\end{pmatrix}$$ Which of the following statements are true?",
        "q": "If we changed some \\(a_{ij}\\) to be zero (0.0), then also \\(a_{ji}\\) would have to be changed to zero for a valid Markov process.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Markov Models. Consider a simple Markov process with 3 states (S1, S2, S3), the following state transition model and a uniform prior state distribution \\(\\pi = [1/3, 1/3, 1/3]\\): $$A = \\begin{pmatrix} 0.4 & 0.3 & 0.3 \\\\ 0.2 & 0.6 & 0.2 \\\\ 0.1 & 0.1 & 0.8 \\end{pmatrix}$$ Which of the following statements are true?",
        "q": "If we made one of these numbers smaller, then at least one number in the same column would have to become larger.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "Rows of \\(A\\) must sum to 1 (not columns), so the constraint is on rows."
      },
      {
        "context": "Markov Models. Consider a simple Markov process with 3 states (S1, S2, S3), the following state transition model and a uniform prior state distribution \\(\\pi = [1/3, 1/3, 1/3]\\): $$A = \\begin{pmatrix} 0.4 & 0.3 & 0.3 \\\\ 0.2 & 0.6 & 0.2 \\\\ 0.1 & 0.1 & 0.8 \\end{pmatrix}$$ Which of the following statements are true?",
        "q": "If we made one of these numbers smaller, then at least one number in the same row would have to become larger.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false
      },
      {
        "context": "Markov Models. Consider a simple Markov process with 3 states (S1, S2, S3), the following state transition model and a uniform prior state distribution \\(\\pi = [1/3, 1/3, 1/3]\\): $$A = \\begin{pmatrix} 0.4 & 0.3 & 0.3 \\\\ 0.2 & 0.6 & 0.2 \\\\ 0.1 & 0.1 & 0.8 \\end{pmatrix}$$ Which of the following statements are true?",
        "q": "The expected number of consecutive occurrences of state S2 is higher than the expected number of consecutive occurrences of state S1.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Self-loop probabilities: \\(a_{22} = 0.6 > a_{11} = 0.4\\), so expected run length in S2 is larger."
      },
      {
        "context": "Markov Models — Identity transition. Now consider a simple Markov process with 3 states (S1, S2, S3), the following state transition model and a uniform prior state distribution \\(\\pi = [1/3, 1/3, 1/3]\\): $$A = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$ What is the probability of the following state sequences, according to this model \\(M\\)?",
        "q": "\\(P((S_1, S_1, S_2, S_2, S_3, S_3) \\mid M) = \\)?",
        "opts": [
          "0",
          "1/3",
          "1/9",
          "1/27",
          "1"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "With identity transition matrix, transitioning from S1 to S2 has probability 0, so the whole sequence has probability 0."
      },
      {
        "context": "Markov Models — Identity transition. Now consider a simple Markov process with 3 states (S1, S2, S3), the following state transition model and a uniform prior state distribution \\(\\pi = [1/3, 1/3, 1/3]\\): $$A = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$ What is the probability of the following state sequences, according to this model \\(M\\)?",
        "q": "\\(P((S_1, S_1, S_1, S_1, S_1) \\mid M) = \\)?",
        "opts": [
          "0",
          "1/3",
          "1/9",
          "1/27",
          "1"
        ],
        "ans": [
          1
        ],
        "multi": false,
        "explanation": "\\(\\pi_1 = 1/3\\) and each self-transition has probability 1."
      },
      {
        "context": "Markov Models — Identity transition. Now consider a simple Markov process with 3 states (S1, S2, S3), the following state transition model and a uniform prior state distribution \\(\\pi = [1/3, 1/3, 1/3]\\): $$A = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$ What is the probability of the following state sequences, according to this model \\(M\\)?",
        "q": "\\(P((S_1, S_2, S_3, S_1, S_2, S_3) \\mid M) = \\)?",
        "opts": [
          "0",
          "1/3",
          "1/9",
          "1/27",
          "1"
        ],
        "ans": [
          0
        ],
        "multi": false,
        "explanation": "Any transition between distinct states has probability 0."
      },
      {
        "context": "Markov Models — Two-City Classification. Consider the classification task of identifying one of two cities A or B, based on a sequence of weather observations. We have learned two Markov models \\(M_A\\) and \\(M_B\\) that model the weather in cities A and B, respectively. Now, given a sequence \\(S\\) of 10 consecutive weather observations, you want to decide which of the two cities this sequence is from, based on the MAP principle.",
        "q": "Which of the following quantities are needed for making this decision?",
        "opts": [
          "\\(P(A)\\)",
          "\\(P(S \\mid M_B)\\)",
          "\\(P(M_B \\mid M_A)\\)",
          "\\(P(S \\mid M_A)\\)",
          "\\(P(B)\\)"
        ],
        "ans": [
          0,
          1,
          3,
          4
        ],
        "multi": true,
        "explanation": "MAP: choose argmax of \\(P(M_c) P(S \\mid M_c)\\) for \\(c \\in \\{A, B\\}\\)."
      },
      {
        "context": "Markov Models — Two-City Classification. Consider the classification task of identifying one of two cities A or B, based on a sequence of weather observations. We have learned two Markov models \\(M_A\\) and \\(M_B\\) that model the weather in cities A and B, respectively. Now, given a sequence \\(S\\) of 10 consecutive weather observations, you want to decide which of the two cities this sequence is from, based on the MAP principle. Which of the following statements are true?",
        "q": "If we produce a new sequence \\(S_2\\) by concatenating two copies of \\(S\\), the likelihoods will change, but the MAP decision will always remain the same.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Markov Models — Two-City Classification. Consider the classification task of identifying one of two cities A or B, based on a sequence of weather observations. We have learned two Markov models \\(M_A\\) and \\(M_B\\) that model the weather in cities A and B, respectively. Now, given a sequence \\(S\\) of 10 consecutive weather observations, you want to decide which of the two cities this sequence is from, based on the MAP principle. Which of the following statements are true?",
        "q": "This kind of classification procedure is only possible if the length of \\(S\\) is at least 2.",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      },
      {
        "context": "Markov Models — Two-City Classification. Consider the classification task of identifying one of two cities A or B, based on a sequence of weather observations. We have learned two Markov models \\(M_A\\) and \\(M_B\\) that model the weather in cities A and B, respectively. Now, given a sequence \\(S\\) of 10 consecutive weather observations, you want to decide which of the two cities this sequence is from, based on the MAP principle. Which of the following statements are true?",
        "q": "The same decision could be made without a Markov model, by counting the different states in \\(S\\).",
        "opts": [
          "True",
          "False"
        ],
        "ans": [
          1
        ],
        "multi": false
      }
    ]
  }
];

const QUIZ_BANK = [...QUIZ_BANK_OLD, ...groupedQuizzes];

function InlineMathText({ text }) {
  if (!text) return null;
  const parts = [];
  // Match inline code `...`, inline math \(...\), or display math $$...$$
  const regex = /`([^`\n]+)`|\\\((.+?)\\\)|\$\$(.+?)\$\$/gs;
  let lastIndex = 0;
  let key = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    if (match[1] !== undefined) {
      parts.push(<code key={key++} className="inline-code">{match[1]}</code>);
    } else {
      const mathStr = match[2] !== undefined ? match[2] : match[3];
      const displayMode = match[2] === undefined;
      try {
        const html = katex.renderToString(mathStr, { displayMode, throwOnError: false });
        parts.push(<span key={key++} dangerouslySetInnerHTML={{ __html: html }} />);
      } catch {
        parts.push(<span key={key++}>{match[0]}</span>);
      }
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }
  return <>{parts}</>;
}

// Top-level rich text: splits triple-backtick fenced code blocks first, then
// delegates remaining text to InlineMathText (which handles inline code and math).
function MathText({ text }) {
  if (!text) return null;
  const codeBlock = /```(?:([\w+-]+)\n)?([\s\S]*?)```/g;
  const out = [];
  let last = 0;
  let key = 0;
  let m;
  while ((m = codeBlock.exec(text)) !== null) {
    if (m.index > last) {
      out.push(<InlineMathText key={key++} text={text.slice(last, m.index)} />);
    }
    out.push(
      <pre key={key++} className={`code-block${m[1] ? ` lang-${m[1]}` : ""}`}>
        <code>{m[2].replace(/\n$/, "")}</code>
      </pre>
    );
    last = codeBlock.lastIndex;
  }
  if (last < text.length) {
    out.push(<InlineMathText key={key++} text={text.slice(last)} />);
  }
  return <>{out}</>;
}

function arrMatch(a, b) {
  return a.length === b.length && [...a].sort().join() === [...b].sort().join();
}

// ── Interactive table input widget ────────────────────────────────────────────
function TableInputWidget({ tableInput, qState, onValChange, onCheck }) {
  const { headers, rows } = tableInput;
  const { vals, results, checked } = qState;
  const editableKeys = rows.flatMap((row, ri) =>
    row.cells.map((cell, ci) => cell.e ? `${ri}-${ci}` : null).filter(Boolean)
  );
  const allCorrect = checked && editableKeys.length > 0 &&
    editableKeys.every(k => results[k] === true);
  const anyChecked = checked && editableKeys.length > 0;

  return (
    <div className="table-input-wrap">
      <div className="table-input-scroll">
        <table className="table-input-tbl">
          {headers && (
            <thead>
              <tr>
                <th className="table-row-hdr-th"></th>
                {headers.map((h, i) => <th key={i} className="table-col-hdr">{h}</th>)}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                <td className="table-row-hdr-td">{row.label || ""}</td>
                {row.cells.map((cell, ci) => {
                  const key = `${ri}-${ci}`;
                  const userVal = vals[key] ?? "";
                  const res = results[key];
                  let cls = "table-input-cell";
                  if (!cell.e) cls += " cell-static-td";
                  else if (checked) cls += res ? " cell-ok" : " cell-err";
                  return (
                    <td key={ci} className={cls}>
                      {cell.e ? (
                        <input
                          className="cell-inp"
                          type="text"
                          value={userVal}
                          onChange={e => onValChange(key, e.target.value)}
                          placeholder="?"
                          spellCheck={false}
                        />
                      ) : (
                        <span className="cell-static-val">{cell.v}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-check-row">
        <button className="btn btn-primary" onClick={onCheck}>
          {checked ? "Re-check" : "Check answers"}
        </button>
        {anyChecked && (
          <span className={allCorrect ? "check-result-ok" : "check-result-err"}>
            {allCorrect
              ? "✓ All correct!"
              : `✗ ${editableKeys.filter(k => results[k] === false).length} cell(s) wrong — fix and re-check`}
          </span>
        )}
      </div>
    </div>
  );
}

function freshState(questions) {
  return {
    sel: questions.map(() => []),
    done: questions.map(() => false),
    scores: questions.map(() => null),
    revealed: questions.map(() => false),
    tableInputs: questions.map(q =>
      q.tableInput ? { vals: {}, results: {}, checked: false } : null
    ),
  };
}

export default function App() {
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [cur, setCur] = useState(0);
  const [state, setState] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  // Per-quiz attempt history. Stored in localStorage under "quiz_stats".
  // Shape: { [quizId]: { best:number, attempts:number, lastPct:number, lastAt:number } }
  const [quizStats, setQuizStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem("quiz_stats") || "{}"); }
    catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem("quiz_stats", JSON.stringify(quizStats));
  }, [quizStats]);

  // Tracks the (activeQuizId) for which we've already saved the current attempt,
  // so the recording useEffect fires exactly once per attempt.
  const [recordedFor, setRecordedFor] = useState(null);

  function recordAttempt(quizId, pct) {
    setQuizStats(prev => {
      const cur = prev[quizId] || { best: 0, attempts: 0, lastPct: 0, lastAt: 0 };
      return {
        ...prev,
        [quizId]: {
          best: Math.max(cur.best, pct),
          attempts: cur.attempts + 1,
          lastPct: pct,
          lastAt: Date.now(),
        }
      };
    });
  }

  function resetQuizStats(quizId, e) {
    e.stopPropagation();
    if (!confirm("Clear saved results for this quiz?")) return;
    setQuizStats(prev => {
      const next = { ...prev };
      delete next[quizId];
      return next;
    });
  }

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [theme]);

  // Safety-net: whenever the results screen becomes visible for the active quiz,
  // record the attempt exactly once. Resets when user leaves the quiz.
  useEffect(() => {
    if (showResults && activeQuizId && state && recordedFor !== activeQuizId) {
      const quiz = QUIZ_BANK.find(q => q.id === activeQuizId);
      if (!quiz) return;
      const total = quiz.questions.length;
      const correct = state.scores.filter(s => s === true).length;
      const pct = Math.round((correct / total) * 100);
      recordAttempt(activeQuizId, pct);
      setRecordedFor(activeQuizId);
    }
    if (!showResults && recordedFor) {
      setRecordedFor(null);
    }
  }, [showResults, activeQuizId, state, recordedFor]);

  function startQuiz(id) {
    setActiveQuizId(id);
    setCur(0);
    setState(freshState(QUIZ_BANK.find(q => q.id === id).questions));
    setShowResults(false);
  }

  function backToMenu() { setActiveQuizId(null); setShowResults(false); }

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  let mainContent;

  if (!activeQuizId) {
    mainContent = (
      <div className="quiz-menu-container">
        <div className="quiz-list-title">JKU Second Semester Pass Master Plan</div>
        <div className="quiz-list-subtitle">Select a quiz to practice exam questions locally</div>
        <div className="quiz-grid">
          {QUIZ_BANK.map(quiz => {
            const stats = quizStats[quiz.id];
            const bestClass = stats
              ? (stats.best >= 90 ? "stat-excellent"
                : stats.best >= 75 ? "stat-great"
                  : stats.best >= 60 ? "stat-good"
                    : "stat-poor")
              : "";
            return (
              <div key={quiz.id} onClick={() => startQuiz(quiz.id)} className={`quiz-card ${stats ? "quiz-card-completed" : ""}`}>
                {stats && <div className="quiz-card-completed-badge">✓ Completed</div>}
                <div className="quiz-card-title">{quiz.title}</div>
                <div className="quiz-card-desc">{quiz.description}</div>
                <div className="quiz-card-meta">{quiz.questions.length} questions</div>
                {stats && (
                  <div className="quiz-card-stats">
                    <span className={`quiz-card-best ${bestClass}`}>Best: {stats.best}%</span>
                    <span className="quiz-card-attempts">{stats.attempts} attempt{stats.attempts === 1 ? "" : "s"}</span>
                    <span className="quiz-card-last">Last: {stats.lastPct}%</span>
                    <button className="quiz-card-reset" onClick={(e) => resetQuizStats(quiz.id, e)} title="Clear saved results">✕</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    const quiz = QUIZ_BANK.find(q => q.id === activeQuizId);
    const Qs = quiz.questions;
    const { sel, done, scores, revealed = [], tableInputs = [] } = state;
    const q = Qs[cur];
    const isDone = done[cur];
    const curSel = sel[cur];
    const correctCount = scores.filter(s => s === true).length;
    const wrongCount = scores.filter(s => s === false).length;
    const allDone = done.every(Boolean);

    function toggle(oi) {
      if (done[cur]) return;
      setState(prev => {
        const next = { ...prev, sel: prev.sel.map(s => [...s]) };
        if (q.multi) {
          const idx = next.sel[cur].indexOf(oi);
          if (idx > -1) next.sel[cur].splice(idx, 1); else next.sel[cur].push(oi);
        } else { next.sel[cur] = [oi]; }
        return next;
      });
    }

    function submit() {
      if (curSel.length === 0) return;
      const correct = arrMatch(curSel, Qs[cur].ans);
      setState(prev => {
        const next = { ...prev, done: [...prev.done], scores: [...prev.scores] };
        next.done[cur] = true; next.scores[cur] = correct; return next;
      });
    }

    // Open-ended (short-answer) helpers: questions where opts.length === 0
    function revealAnswer() {
      setState(prev => {
        const rev = [...(prev.revealed || Qs.map(() => false))];
        rev[cur] = true;
        return { ...prev, revealed: rev };
      });
    }
    function continueOpenEnded() {
      setState(prev => {
        const next = {
          ...prev,
          done: [...prev.done],
          scores: [...prev.scores],
          revealed: [...(prev.revealed || Qs.map(() => false))],
        };
        next.revealed[cur] = true;
        next.done[cur] = true;
        // Auto-correct so open-ended doesn't penalise the score
        next.scores[cur] = true;
        return next;
      });
      if (cur < Qs.length - 1) setCur(c => c + 1);
    }
    // Table input handlers
    function updateTableVal(key, val) {
      setState(prev => {
        const ti = [...(prev.tableInputs || [])];
        ti[cur] = { ...ti[cur], vals: { ...ti[cur].vals, [key]: val } };
        return { ...prev, tableInputs: ti };
      });
    }
    function checkTableAnswers() {
      const tInput = q.tableInput;
      const ti = tableInputs[cur] || { vals: {} };
      const results = {};
      let allCorrect = true;
      tInput.rows.forEach((row, ri) => {
        row.cells.forEach((cell, ci) => {
          if (cell.e) {
            const key = `${ri}-${ci}`;
            const userVal = (ti.vals[key] || "").trim().toLowerCase().replace(/\s+/g, "");
            const correctVal = cell.v.trim().toLowerCase().replace(/\s+/g, "");
            const ok = userVal === correctVal;
            results[key] = ok;
            if (!ok) allCorrect = false;
          }
        });
      });
      setState(prev => {
        const newTi = [...(prev.tableInputs || [])];
        newTi[cur] = { ...newTi[cur], results, checked: true };
        const newDone = [...prev.done];
        const newScores = [...prev.scores];
        if (allCorrect) { newDone[cur] = true; newScores[cur] = true; }
        return { ...prev, tableInputs: newTi, done: newDone, scores: newScores };
      });
    }
    function continueTableInput() {
      setState(prev => {
        const next = { ...prev, done: [...prev.done], scores: [...prev.scores] };
        next.done[cur] = true;
        next.scores[cur] = tableInputs[cur]?.checked
          ? (Object.values(tableInputs[cur].results).every(Boolean) ? true : false)
          : false;
        return next;
      });
      if (cur < Qs.length - 1) setCur(c => c + 1);
    }

    const isTableInput = !!q.tableInput;
    const isOpenEnded = !isTableInput && (!q.opts || q.opts.length === 0);
    const isRevealed = revealed[cur] === true;

    if (showResults) {
      const pct = Math.round(correctCount / Qs.length * 100);
      const grade = pct >= 90 ? "Excellent! 🏆" : pct >= 75 ? "Great job! ⭐" : pct >= 60 ? "Good effort! 👍" : "Keep studying! 📚";
      mainContent = (
        <div className="quiz-container results-container">
          <div className="results-meta">{quiz.title}</div>
          <div className="results-pct">{pct}%</div>
          <div className="results-grade">{grade}</div>

          <div className="results-stats-grid">
            <div className="stat-card">
              <div className="stat-num" style={{ color: "#10b981" }}>{correctCount}</div>
              <div className="stat-label">Correct</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{ color: "#ef4444" }}>{Qs.length - correctCount}</div>
              <div className="stat-label">Wrong</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{ color: "var(--text-main)" }}>{Qs.length}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => startQuiz(activeQuizId)} className="btn btn-primary">Restart quiz</button>
            <button onClick={backToMenu} className="btn btn-secondary">← All quizzes</button>
          </div>
        </div>
      );
    } else {
      mainContent = (
        <div className="quiz-container">
          <div className="quiz-header">
            <button onClick={backToMenu} className="back-button">← Quizzes</button>
            <div style={{ display: "flex", gap: 8 }}>
              <span className="score-badge-correct">✓ {correctCount}</span>
              <span className="score-badge-wrong">✗ {wrongCount}</span>
            </div>
          </div>

          <div className="progress-info">
            <span>Question {cur + 1} of {Qs.length}</span>
            <span>{isTableInput ? "Fill in the table" : isOpenEnded ? "Open answer" : q.multi ? "Select all that apply" : "Select one answer"}</span>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${Math.round((cur + 1) / Qs.length * 100)}%` }} />
          </div>

          {q.context && (
            <div className="question-context">
              <MathText text={q.context} />
            </div>
          )}
          <div className="question-text">
            <MathText text={q.q} />
          </div>

          {!isOpenEnded && (
            <div className="options-container">
              {q.opts.map((o, oi) => {
                const isC = q.ans.includes(oi), isS = curSel.includes(oi);
                let btnClass = "option-button";
                if (isDone) {
                  if (isS && isC) btnClass += " correct";
                  else if (isS && !isC) btnClass += " wrong";
                  else if (!isS && isC) btnClass += " correct";
                } else if (isS) {
                  btnClass += " selected";
                }
                return (
                  <button key={oi} onClick={() => toggle(oi)} disabled={isDone} className={btnClass}>
                    <span style={{ fontWeight: "700", marginRight: "8px" }}>{String.fromCharCode(65 + oi)}.</span>
                    <MathText text={o} />
                  </button>
                );
              })}
            </div>
          )}

          {isTableInput && tableInputs[cur] && (
            <div className="openended-container">
              <TableInputWidget
                tableInput={q.tableInput}
                qState={tableInputs[cur]}
                onValChange={updateTableVal}
                onCheck={checkTableAnswers}
              />
              {tableInputs[cur].checked && q.explanation && (
                <details className="table-answer-details">
                  <summary></summary>
                  <div className="openended-answer-body">
                    <MathText text={q.explanation} />
                  </div>
                </details>
              )}
            </div>
          )}

          {isOpenEnded && (
            <div className="openended-container">
              <div className="openended-note">Short-answer question — no multiple-choice options in the original exam.</div>
              {!isRevealed && (
                <button onClick={revealAnswer} className="btn btn-primary openended-reveal-btn">
                  Reveal reference answer
                </button>
              )}
              {isRevealed && (
                <div className="openended-answer-box">
                  <div className="openended-answer-label">Reference answer</div>
                  <div className="openended-answer-body">
                    {q.explanation
                      ? <MathText text={q.explanation} />
                      : <em>No reference answer was provided in the source PDF.</em>}
                  </div>
                </div>
              )}
            </div>
          )}

          {!isOpenEnded && isDone && (
            <div className={`feedback-container ${scores[cur] ? "feedback-correct" : "feedback-wrong"}`}>
              <span style={{ fontSize: "18px" }}>{scores[cur] ? "✓" : "✗"}</span>
              <div>
                <div>{scores[cur] ? "Correct!" : "Not quite."}</div>
                {!scores[cur] && q.ans.length > 0 && (
                  <div className="feedback-correct-answer">
                    <strong>Correct {q.ans.length === 1 ? "answer" : "answers"}:</strong>{" "}
                    {q.ans.map((i, idx) => (
                      <span key={i}>
                        {idx > 0 && " | "}
                        <strong>{String.fromCharCode(65 + i)}.</strong> <MathText text={q.opts[i]} />
                      </span>
                    ))}
                  </div>
                )}
                {q.explanation && (
                  <div className="feedback-explanation">
                    <MathText text={q.explanation} />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="action-buttons">
            {cur > 0 && <button onClick={() => setCur(c => c - 1)} className="btn btn-secondary">← Back</button>}
            {!isOpenEnded && !isTableInput && !isDone && <button onClick={submit} className="btn btn-primary" disabled={curSel.length === 0}>Check answer</button>}
            {!isOpenEnded && !isTableInput && isDone && cur < Qs.length - 1 && <button onClick={() => setCur(c => c + 1)} className="btn btn-primary">Next →</button>}
            {!isOpenEnded && !isTableInput && !isDone && cur < Qs.length - 1 && <button onClick={() => setCur(c => c + 1)} className="btn btn-secondary">Skip →</button>}
            {isOpenEnded && isRevealed && cur < Qs.length - 1 && <button onClick={continueOpenEnded} className="btn btn-primary">Continue →</button>}
            {isOpenEnded && !isRevealed && cur < Qs.length - 1 && <button onClick={() => setCur(c => c + 1)} className="btn btn-secondary">Skip →</button>}
            {isOpenEnded && isRevealed && cur === Qs.length - 1 && !isDone && <button onClick={continueOpenEnded} className="btn btn-primary">Mark done</button>}
            {isTableInput && !isDone && cur < Qs.length - 1 && <button onClick={continueTableInput} className="btn btn-secondary">Skip →</button>}
            {isTableInput && isDone && cur < Qs.length - 1 && <button onClick={() => setCur(c => c + 1)} className="btn btn-primary">Next →</button>}
            {isTableInput && !isDone && tableInputs[cur]?.checked && cur < Qs.length - 1 && <button onClick={continueTableInput} className="btn btn-primary">Continue →</button>}
            {isTableInput && !isDone && cur === Qs.length - 1 && tableInputs[cur]?.checked && <button onClick={continueTableInput} className="btn btn-primary">Mark done</button>}
            {cur === Qs.length - 1 && (
              <button
                onClick={() => {
                  if (!allDone && !confirm("Some questions are not answered — they will count as wrong. See results anyway?")) return;
                  setShowResults(true);
                }}
                className="btn btn-success"
              >
                See results
              </button>
            )}
          </div>

          <div className="dot-navigation">
            {Qs.map((_, i) => {
              let dotClass = "nav-dot";
              if (i === cur) dotClass += " current";
              else if (done[i]) dotClass += scores[i] ? " correct" : " wrong";
              else dotClass += " unvisited";

              return (
                <button key={i} onClick={() => setCur(i)} title={`Q${i + 1}`} className={dotClass} />
              );
            })}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-brand" onClick={backToMenu} style={{ cursor: "pointer" }}>
          <span className="brand-logo">🎓</span>
          <span className="brand-name">#thanksclaude</span>
        </div>
        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle Theme">
          {theme === 'light' ? (
            <svg className="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </header>
      <main className="app-main">
        {mainContent}
      </main>
    </div>
  );
}
