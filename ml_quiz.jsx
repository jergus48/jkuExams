import { useState } from "react";

const QUIZ_BANK = [
  {
    id: "jku_ml_2024",
    title: "ML Exam — JKU June 2024",
    description: "Neural networks, RNNs, LSTMs, RL, drug discovery",
    questions: [
      { q: "Which statements are true about QSAR?", opts: ["The bio-activity is determined by the molecular structure.","The hypothesis is that similar molecular structures have similar activities.","The hypothesis is that similar activities have similar molecular structures.","The molecular structure is determined by the bio-activity."], ans: [0,1], multi: true },
      { q: "Which are typical activation functions in neural networks?", opts: ["Tanh","SELU","Leaky ReLU","Sigmoid"], ans: [0,1,2,3], multi: true },
      { q: "Which statements are true about many-to-one RNN types?", opts: ["Given Tx=5, output length Ty=Tx.","Given input length Tx, output length is always 1.","Suitable where each input maps to one output.","Suitable where entire input is needed to predict a single output."], ans: [1,3], multi: true },
      { q: "In a 20×20 RL grid (4 moves, off-grid penalty -5, target +20), which are true?", opts: ["There are policies that never reach the target.","There are policies that reach target but have final reward < 20.","Policies A and B can both be optimal despite different total steps.","An optimal policy will give a final reward of 20."], ans: [0,1,2,3], multi: true },
      { q: "Which statements about self-attention in language models are true?", opts: ["Self-attention creates contextualized word embeddings.","Self-attention allows the model to weigh importance of different words.","Self-attention only works for short sentences.","Self-attention helps capture long-range dependencies."], ans: [0,1,3], multi: true },
      { q: "Which statements about virtual screening (VS) are true?", opts: ["A trained NN searches the whole chemical universe.","A trained NN predicts if a molecule is likely to bind/react with the target.","A trained NN predicts the 3D configuration of a protein.","A trained NN creates new molecules with specified bio-activity."], ans: [1], multi: false },
      { q: "Which are parts of a Markov decision process?", opts: ["A set of possible state transitions.","A set of possible q-values.","A set of possible rewards.","A set of possible states."], ans: [2,3], multi: true },
      { q: "The 3D structure of a molecule ...", opts: ["... can be different for the same molecular graph.","... can be easily determined experimentally.","... can be inferred from the SMILES representation.","... determines its functionality."], ans: [0,3], multi: true },
      { q: "What is the data flow through a Transformer language model?", opts: ["input → feed-forward → self-attention → embedding → output","input → embedding → feed-forward → self-attention → output","input → self-attention → embedding → feed-forward → output","input → embedding → self-attention → feed-forward → output"], ans: [3], multi: false },
      { q: "Dictionary=5000, embedding=200, hidden=300. Output size for a single word?", opts: ["300","5000","200","400"], ans: [1], multi: false },
      { q: "Backpropagation through time ...", opts: ["... is the method used to train RNNs.","... mitigates the vanishing gradient problem.","... cannot be used when input exceeds a maximum length.","... means different weights are used for every timestep."], ans: [0], multi: false },
      { q: "A 100×100 grayscale image with 3 kernels of 5×5 (no padding) produces ...", opts: ["... three output feature maps.","... a 5×5 kernel cannot be applied to 100×100.","... one output feature map with average of three channels.","... output resolution of 96×96."], ans: [0,3], multi: true },
      { q: "Which statements about the vanishing gradient problem are true?", opts: ["Gradients > 1 repeated → exploding gradient.","Normalizing inputs mitigates vanishing gradients.","Gradients < 1 repeated → vanishing gradient.","Vanishing gradient occurs more in classification than regression."], ans: [0,2], multi: true },
      { q: "Which statements about gradient descent are true?", opts: ["It might get stuck at a local minimum.","Initial parameter values can be chosen randomly.","It can update weights of neural networks.","It is an analytical method."], ans: [0,1,2], multi: true },
      { q: "Comparing LSTM to a standard RNN, which are true?", opts: ["LSTM generally performs better irrespective of sequence length.","LSTM is less prone to the vanishing gradient problem.","Standard RNN is computationally more efficient.","Standard RNN has fewer model parameters."], ans: [0,1,2,3], multi: true },
      { q: "Which statements about attention mechanisms are true?", opts: ["They reduce computational complexity.","They reduce the number of parameters to train.","They help the model focus on relevant parts of the input.","They require a fixed-size input sequence."], ans: [2], multi: false },
      { q: "What are typical challenges in traditional drug discovery?", opts: ["It is very time-consuming.","Success rates are about 50%.","It is an expensive process.","Finding suitable molecules is difficult due to the huge candidate space."], ans: [0,2,3], multi: true },
      { q: "In classification ...", opts: ["... target value must be a string of characters.","... target value is a class label.","... we use Mean Squared Error Loss.","... there can only be two classes."], ans: [1], multi: false },
      { q: "Which statements about the tanh activation function are true?", opts: ["tanh is not differentiable for some inputs.","Its derivative is small for very large positive inputs.","Derivative for negative inputs is -1.","Maximum derivative value is at input 0."], ans: [1,3], multi: true },
      { q: "Deep networks and vanishing gradients — which are true?", opts: ["Deeper networks → more multiplications in backward pass.","Increasing learning rate mitigates vanishing gradients in deep nets.","Vanishing gradient typically occurs near the output layer.","Choice of activation function does not affect the problem."], ans: [0], multi: false },
      { q: "In CNNs, weight sharing means ...", opts: ["... kernel applied to one position, weights fixed.","... kernel applied to one position, weights updated continuously.","... kernel applied to all positions, weights updated continuously.","... kernel applied to all positions, weights fixed."], ans: [3], multi: false },
      { q: "A non-convex function ...", opts: ["... can have several local minima.","... typically has no closed-form solution.","... often requires iterative methods for minimum.","... is common in deep learning."], ans: [0,1,2,3], multi: true },
      { q: "Dictionary=1000, embedding=150, hidden=100. Which are true for a single word input?", opts: ["Model output probabilities sum to 1.","Embedding and decoder matrices have equally many parameters.","Embedding matrix is identical to decoder matrix.","Decoder output size is 1000."], ans: [0,3], multi: true },
      { q: "In a Markov decision process ...", opts: ["... positive reward always given for desirable state.","... rewards can be 0.","... negative rewards are possible.","... next action depends on all previous states."], ans: [1,2], multi: true },
      { q: "Which statements about Q-learning are true?", opts: ["Q-learning is one implementation of reinforcement learning.","Major advantage: computationally efficient for larger MDPs.","Deep Q-learning approximates the Q-value function.","Q-learning can be applied to any MDP."], ans: [0,2,3], multi: true },
      { q: "Which statements about data normalization are true?", opts: ["It can improve ML model performance.","It is only useful for image data.","It standardizes the range of features.","It increases the range of data."], ans: [0,2], multi: true },
      { q: "In Q-learning, which statements about choosing actions are true?", opts: ["Action can be chosen randomly.","Action can be chosen based on highest Q-value.","A suboptimal action might cause Q-learning to get stuck.","'Exploration' and 'Exploitation' are action strategies."], ans: [0,1,2,3], multi: true },
      { q: "Sequence of 20 elements, 5 features each, single-layer RNN with hidden size 10. Size of first output?", opts: ["10","25","5","20"], ans: [0], multi: false },
      { q: "σ'(x) is the sigmoid derivative. y = σ'(500) × σ'(-200). Which is correct?", opts: ["y ≈ 1/16","y ≈ 1","y ≈ 0","y < 0"], ans: [2], multi: false },
      { q: "Which activation functions are prone to the vanishing gradient problem?", opts: ["Leaky ReLU","Hardsigmoid","Tanh","Sigmoid"], ans: [1,2,3], multi: true },
      { q: "The forget gate in an LSTM ...", opts: ["... determines the final output of the LSTM cell.","... adds new information to the cell state.","... decides what information to discard from the cell state.","... is crucial for controlling the cell state."], ans: [2,3], multi: true },
      { q: "Q(s,a) ← (1-α)·Q(s,a) + α·(r + γ·max Q(s',a')). Which are true?", opts: ["α=0 means only new information is used.","α=1 means only new information is used.","α is the learning rate.","r is the expected long-term reward."], ans: [1,2], multi: true },
      { q: "Which statements about LSTM networks are true?", opts: ["Not suitable for sequential data.","Contain gates that control information flow.","Designed to remember information long-term.","Less complex than standard RNNs."], ans: [1,2], multi: true },
      { q: "Which statements about SMILES are true?", opts: ["SMILES captures 3D structural information.","It is a string sequence representation of a molecule.","SMILES is one of many molecular representations.","A molecule can have different SMILES representations."], ans: [1,2,3], multi: true },
      { q: "Which statements about an optimal policy are true?", opts: ["It maximizes cumulative reward.","Choosing highest immediate reward doesn't necessarily lead to optimal policy.","Q-learning is an optimal policy.","There can be multiple optimal policies."], ans: [0,1,3], multi: true },
      { q: "Correct formula for forward pass (input x, weights W, bias b, activation f)?", opts: ["output = x · f(W + b)","output = f(x · W) + b","output = f(x · W + b)","output = f(x) · W + b"], ans: [2], multi: false },
      { q: "Which statements about overfitting are true?", opts: ["Overfitting means the model won't generalize well.","Overfitting can be mitigated by a different loss function.","Overfitting occurs when loss decreases linearly over epochs.","Overfitting occurs when train and test loss differ significantly."], ans: [0,3], multi: true },
    ]
  },
  {
    id: "jku_retry_sep2023",
    title: "ML Retry Exam — JKU Sep 2023",
    description: "Q-learning, data augmentation, protein folding, CNNs, RNNs",
    questions: [
      { q: "Q-learning update: Q(s,a)←(1-α)Q(s,a)+α(r+γ max Q(s',a')). Which are true?", opts: ["α=1 means no update is performed.","γ=0 means only take the immediate reward into account.","α is the discount factor.","γ=1 means put strong emphasis on future rewards."], ans: [1,3], multi: true },
      { q: "Which statements about data augmentation are true?", opts: ["Not every augmentation technique is useful in every scenario.","Data augmentation might reduce overfitting.","Data augmentation is useful to artificially create more samples.","Data augmentation is useful to decrease variation in the data."], ans: [0,1,2], multi: true },
      { q: "Sequence of 50 elements, 9 features each, single-layer RNN with hidden size 12. Size of first output?", opts: ["12","600","9","50"], ans: [0], multi: false },
      { q: "Correct formula for forward pass (input x, weights W, bias b, activation f)?", opts: ["output = f(x * W + b)","output = f(x) * W + b","output = x * f(W + b)","output = f(x * W) + b"], ans: [0], multi: false },
      { q: "The protein folding problem deals with ...", opts: ["... predicting the amino acid sequence from 3D structure.","... predicting biological functionality from 3D structure.","... predicting the 3D structure from the amino acid sequence.","... determining how to fold a protein for desired functionality."], ans: [2], multi: false },
      { q: "In gradient descent ...", opts: ["... small gradients mean the learning rate was chosen incorrectly.","... new param value = old param value minus learning rate × gradient of loss.","... convergence indicates a global minimum has been found.","... the learning rate determines the step size."], ans: [1,3], multi: true },
      { q: "Which statements about generative models in drug discovery are true?", opts: ["Generative models replace virtual screening models.","Generative models generate new bioactivities for existing molecules.","Generative models are promising since the chemical universe is too big for standard techniques.","Generative models generate new molecules according to target bioactivity."], ans: [2,3], multi: true },
      { q: "Vanishing gradient in deep networks — which are true?", opts: ["Deeper network → more chain-rule multiplications in backward pass.","The used activation functions play a significant role.","Vanishing gradient typically occurs towards the input layer.","Deep networks will always suffer from vanishing gradient."], ans: [0,1,2], multi: true },
      { q: "A non-convex function ...", opts: ["... is extremely rare in deep learning.","... always has a closed-form solution.","... often requires iterative methods for minimum.","... often has multiple local minima."], ans: [2,3], multi: true },
      { q: "Convolution of a 12×12 image with 4 channels using 2 kernels of size 3×3 produces ...", opts: ["... an output with 3 feature maps.","... an output with 12 feature maps.","... an output with 2 feature maps.","... an output with 4 feature maps."], ans: [2], multi: false },
      { q: "Gating in an LSTM selects important information ...", opts: ["... by element-wise multiplication with a number between -1 (closed) and +1 (open).","... by element-wise multiplication with a number between 0 (closed) and +1 (open).","... by comparing the feature vector with the accompanying target.","... by combining the feature vector with output of previous timestep."], ans: [1], multi: false },
      { q: "Why is it a good idea to have a separate test set?", opts: ["It allows a better estimate of the generalization error.","It enables the use of different model architectures.","Empirical risk minimization can be performed on two datasets.","It allows to detect overfitting."], ans: [0,3], multi: true },
      { q: "Which statements about recurrent neural networks are true?", opts: ["They incorporate information from the current timestep only.","They are suitable for processing sequences of fixed length.","They are suitable for processing sequences of variable length.","They incorporate information from previous timesteps."], ans: [1,2,3], multi: true },
      { q: "In a Markov decision process ...", opts: ["... rewards can be positive.","... rewards can be 0.","... rewards can be negative.","... reward is associated with transition from one state to another."], ans: [0,1,2,3], multi: true },
      { q: "Which statements about gating/gates in an LSTM are true?", opts: ["All gates are optional.","Gates depend on the current input and the past.","Typically, sigmoid is used as gate function.","Gating controls what to read/write/forget in memory."], ans: [1,2,3], multi: true },
      { q: "Which statements about QSAR are true?", opts: ["The hypothesis is that similar molecular structures have similar activities.","The hypothesis is that similar activities have similar molecular structures.","The molecular structure is determined by the bio-activity.","The bio-activity is determined by the molecular structure."], ans: [0,3], multi: true },
      { q: "Which statements about the one-to-many RNN type are true?", opts: ["Given input Tx=1, output length Ty>1.","Given input Tx>1, output length Ty=1.","Given input Tx>1, output length Ty>1.","Given input Tx=1, output length Ty=1."], ans: [0], multi: false },
      { q: "What is the general data flow through an RNN language model?", opts: ["input → encoder → RNN → decoder","input → RNN → encoder → decoder","input → decoder → RNN → encoder","input → encoder → decoder → RNN"], ans: [0], multi: false },
      { q: "Which statements about activation functions in neural networks are true?", opts: ["Activation functions introduce non-linearity.","Activation functions enable stacking of multiple network layers.","Different activation functions might lead to different training results.","After training, activation functions can be discarded."], ans: [0,1,2], multi: true },
      { q: "In the context of language models, which statements about an embedding are true?", opts: ["The decoder part is closely related to a word embedding.","The encoder part is closely related to a word embedding.","An embedding is a compact string representation of words.","An embedding contains probabilities of a word occurring in a corpus."], ans: [1], multi: false },
      { q: "Which statements about translation invariance are true?", opts: ["It refers to the problem where networks learn to ignore object position.","In neural networks, it can be implemented via convolutional layers.","It is desirable for models that classify content of natural images.","In deep networks, it indicates similar gradient magnitudes across layers."], ans: [1,2], multi: true },
      { q: "The original CEC (constant error carousel) of an LSTM ...", opts: ["... can mitigate the vanishing gradient problem.","... uses non-linear functions to modify the cell state.","... is an optional part.","... is influenced by the introduction of the forget gate."], ans: [0,3], multi: true },
      { q: "Back-propagation through time allows ...", opts: ["... mitigation of vanishing gradients in unrolled RNNs.","... an RNN to process input in reversed order.","... calculation of the gradient of the loss w.r.t. RNN's weights.","... an RNN to recall previously seen sequence elements."], ans: [2], multi: false },
      { q: "Which statements about reinforcement learning are true?", opts: ["The goal is to learn the optimal policy.","A RL problem can be formulated as a Markov decision process.","Often, initial knowledge about transition probabilities is missing.","Games are one of many application areas."], ans: [0,1,2,3], multi: true },
      { q: "Dictionary=12000, embedding=350, hidden=300. Output size for a single word?", opts: ["350","12000","300","300×350=105000"], ans: [1], multi: false },
      { q: "The 3D structure of a molecule ...", opts: ["... is expensive to determine experimentally.","... is independent of the molecule's functionality.","... is unambiguously determined by a molecular graph.","... is straightforward to predict if sequence of atoms is known."], ans: [0], multi: false },
      { q: "Which statements about the ReLU activation function are true?", opts: ["For positive inputs, ReLU is equivalent to Leaky ReLU.","The derivative is easy to compute.","For negative inputs, the derivative is 0.","For positive inputs, ReLU equates to the identity function."], ans: [0,1,2,3], multi: true },
      { q: "Which statements about the concept of an optimal policy are true?", opts: ["It minimizes the sum of rewards.","Applying optimal policy means maximizing immediate reward.","The optimal policy may be obtained via Q-learning.","There can be multiple optimal policies."], ans: [2,3], multi: true },
      { q: "Which statements about SMILES are true?", opts: ["A molecule can have different SMILES representations.","A molecule can only have exactly one SMILES representation.","A molecular graph can be transformed into SMILES and vice versa.","It is a tabular data representation."], ans: [0,2], multi: true },
      { q: "Which statements about the vanishing gradient problem are true?", opts: ["Repeated multiplication of gradients > 1 → vanishing gradient.","To avoid the problem, gradients should ideally be 0.","Repeated multiplication of gradients < 1 → vanishing gradient.","Vanishing gradients make training of a NN extremely difficult."], ans: [2,3], multi: true },
      { q: "Which statements about RNN language models are true?", opts: ["The overall loss is the average loss over the entire training set.","At each position, a loss is calculated based on decoder's prediction for next word.","At end of sequence, one final loss is calculated based on sequence overlap.","The overall loss is often calculated over mini-batches."], ans: [0,1,3], multi: true },
      { q: "Which statements about sequence data and feed-forward neural networks are true?", opts: ["If sequence length is equal, feed-forward NN behaves same as RNN.","Sequence data cannot be an input to a feed-forward NN.","Sequences with variable lengths must be preprocessed.","The relation of elements in the sequence is lost."], ans: [2,3], multi: true },
      { q: "Dictionary=5000, embedding=400, hidden=400. Which are true for a single word input?", opts: ["The encoder and decoder matrices have equally many parameters.","The encoder matrix is identical to the decoder matrix.","The decoder results in an output of size 400.","The maximum input sequence length is 400."], ans: [0], multi: false },
      { q: "Which activation functions can be used to mitigate the vanishing gradient problem?", opts: ["Sigmoid","SELU","ReLU","Tanh"], ans: [1,2], multi: true },
      { q: "The goal of Q-learning is to ...", opts: ["... find the optimal degree of exploration and exploitation.","... predict the agent's next action based on previous actions.","... approximate the expected reward for the next state-transition.","... approximate the Q-values of state-action pairs of an MDP."], ans: [3], multi: false },
      { q: "RL scenario: 6×6 grid, reward -1 per move, +1 at target. Which are true?", opts: ["With a bad policy, target might not be reached at all.","Maximum steps of any policy is 6×6×4=144.","All target-reaching policies have the same aggregated reward.","An optimal policy always has aggregated positive reward for every starting state."], ans: [0], multi: false },
      { q: "In regression ...", opts: ["... the target value is numeric.","... there can only be multiple classes.","... we are dealing with unsupervised learning.","... the target value is a class label."], ans: [0], multi: false },
      { q: "Which statements about tabular data are true?", opts: ["Tabular data can only be used in supervised learning.","Tabular data might contain duplicate rows.","In principle, images can be stored in tabular form.","Rows in the table are called samples."], ans: [1,2,3], multi: true },
      { q: "Which statements about virtual screening (VS) are true?", opts: ["In VS, a trained NN predicts whether a molecule is likely to bind/react with the target.","In VS, a trained NN predicts the most relevant target molecule.","In VS, a trained NN virtually searches the whole chemical universe.","In VS, a trained NN predicts the toxicity of a drug."], ans: [0], multi: false },
      { q: "y = σ'(-400) × σ'(300). Which is correct?", opts: ["y is close to 1/4.","y is close to 0.","y is close to 1/16.","y is close to 1."], ans: [1], multi: false },
    ]
  },
  {
    id: "jku_retry2_sep2024",
    title: "ML Retry Exam 2 — JKU Sep 2024",
    description: "Convex functions, RL, LSTM gates, CNNs, Transformers, dimensionality reduction",
    questions: [
      { q: "A convex function ...", opts: ["... sometimes has an analytical solution for computing its minimum.","... always has an analytical solution for computing its minimum.","... can have several local minima.","... can also be solved iteratively (e.g., via gradient descent)."], ans: [0,3], multi: true },
      { q: "RL scenario: 5×5 grid, reward -2 per move, +15 at target. Which are true?", opts: ["Maximum steps of an optimal policy is 8.","With a bad policy, target might not be reached at all.","An optimal policy always has aggregated positive reward for every starting state.","Maximum steps of any policy is 5×5×4=100."], ans: [0,1], multi: true },
      { q: "Sequence of 8 elements, 10 features each, single-layer RNN with hidden size 6. Size of first output?", opts: ["16","48","4","6"], ans: [3], multi: false },
      { q: "Back-propagation through time ...", opts: ["... allows mitigation of vanishing gradients in unrolled RNNs.","... is commonly used to train an RNN.","... generates potentially very wide (but not deep) networks.","... is the cause of vanishing gradients in RNNs."], ans: [1], multi: false },
      { q: "Sequence data s of length T with D features at every timestep t. Which are true about different samples?", opts: ["D is constant between samples.","For one specific sample, t can be greater than T.","T is constant between samples.","D can vary between samples."], ans: [0], multi: false },
      { q: "Q-learning update: Q(s,a)←(1-α)Q(s,a)+α(r+γ max Q(s',a')). Which are true?", opts: ["α is the learning rate.","α=1 means no update at all is performed.","0<α<1 means both old Q-value and new information are used.","α=0 means no update at all is performed."], ans: [0,2,3], multi: true },
      { q: "Gating in an LSTM selects important information ...", opts: ["... by element-wise multiplication between -1 (closed) and +1 (open).","... by element-wise multiplication between 0 (closed) and +1 (open).","... by element-wise comparison to previous timestep feature vector.","... by averaging all elements and applying a threshold between 0 and 1."], ans: [1], multi: false },
      { q: "In a Markov decision process ...", opts: ["... rewards can be 0.","... rewards can be positive.","... reward is associated with the transition from one state to another.","... rewards can be negative."], ans: [0,1,2,3], multi: true },
      { q: "In CNNs, which statements about convolutional layers are true?", opts: ["Input values must be normalized to range 0 and 1.","Weight sharing means several kernels are applied to all positions using same weights per kernel.","A convolutional layer might reduce the resolution of the image.","There must be more output feature maps than input feature maps."], ans: [2], multi: false },
      { q: "In the context of language models, which statements about an embedding are true?", opts: ["Elements in a word embedding are not allowed to have any relationship with each other.","The encoder part of a language model is closely related to a word embedding.","An embedding contains the frequency of a word occurring in a text corpus.","An embedding is a mapping of a word to similar words."], ans: [1], multi: false },
      { q: "In the forward pass of a neural network, the input vector is ...", opts: ["... passed through element-wise non-linearity, multiplied by weight matrix and added to bias.","... added to bias weights, multiplied by weight matrix and passed through non-linearity.","... multiplied by a weight matrix, added to bias weights and passed through element-wise non-linearity.","... passed through element-wise non-linearity, added to bias weights and multiplied by weight matrix."], ans: [2], multi: false },
      { q: "Max-pooling ...", opts: ["... involves trainable parameters.","... is a form of subsampling.","... may decrease the spatial size of the data.","... eases the computational demand."], ans: [1,2,3], multi: true },
      { q: "Softmax ...", opts: ["... is a generalization of the tanh function.","... is a method to compute probabilities.","... can only be used if there are more than 2 classes.","... is computed with the formula e^zi / sum(e^zj)."], ans: [1,3], multi: true },
      { q: "The 3D structure of a molecule ...", opts: ["... is ambiguously determined by a molecular graph.","... can be inferred from the SMILES representation.","... is independent of the molecule's functionality.","... can be experimentally determined."], ans: [0,3], multi: true },
      { q: "Convolution of a 30×30 image with 3 channels using 5 kernels of 5×5 produces ...", opts: ["... an output with 5 feature maps.","... an output with 3×5=15 feature maps.","... an output with 1 feature map.","... an output with (30×30)/(5×5)=36 feature maps."], ans: [0], multi: false },
      { q: "The output gate of an LSTM ...", opts: ["... is typically ReLU activated.","... will determine the next cell state.","... will determine the output of the Constant Error Carousel (CEC).","... will determine the next hidden state of the LSTM."], ans: [3], multi: false },
      { q: "The tanh function tanh(x) ...", opts: ["... scales values to the range (0, 1).","... scales values to the range (-1, 1).","... scales values to the range (-x, x).","... scales values to the range (0, x)."], ans: [1], multi: false },
      { q: "Problems of RNN-based language models compared to Transformer models?", opts: ["LSTMs can have problems capturing contextual information for long sequences.","Word embeddings can have lower dimensionality in Transformer models.","Transformer models have a lower parameter count.","RNN based models cannot be computed in parallel."], ans: [0,3], multi: true },
      { q: "What is the general data flow through a Transformer language model?", opts: ["input → Self-Attention → encoder → Feed-Forward → decoder","input → encoder → Self-Attention → Feed-Forward → decoder","input → decoder → Feed-Forward → Self-Attention → encoder","input → encoder → Feed-Forward → Self-Attention → decoder"], ans: [1], multi: false },
      { q: "Which statements about (deep) Q-learning are true?", opts: ["Deep Q-learning is about approximating the Q-value function.","Deep Q-learning is often necessary for larger MDPs.","Q-learning is an implementation of reinforcement learning.","Q-learning can be applied to any MDP."], ans: [0,1,2,3], multi: true },
      { q: "Which statements about dimensionality reduction are true?", opts: ["If very high dimensional, dimensionality reduction must be applied before model training.","One popular algorithm is k-means.","Information will be lost by downprojecting data to e.g. 2 dimensions.","Dimensionality reduction techniques are useful for visualizing high dimensional data."], ans: [2,3], multi: true },
      { q: "Which statements about gating/gates in an LSTM are true?", opts: ["Typically, ReLU is used as gate function.","Gates are not affected by gradient computations.","All gates are optional.","Gates depend on the current input and the past."], ans: [3], multi: false },
      { q: "Which statements about gradient descent are true?", opts: ["It might converge to a local minimum.","It is an iterative method.","The initial starting value of a parameter can be chosen randomly.","The learning rate influences how much the value of a parameter changes."], ans: [0,1,2,3], multi: true },
      { q: "Which statements about high throughput screening (HTS) are true?", opts: ["In HTS, a trained NN predicts the 3D structure of a molecule.","In HTS, a trained NN predicts whether a molecule is likely to bind/react with the target.","In HTS, a trained NN predicts the most relevant target molecule.","In HTS, is an expensive and time consuming process."], ans: [3], multi: false },
      { q: "Which statements about language models are true?", opts: ["Language modeling is the task of predicting a context given a word.","Language modeling is the task of predicting a word given a context.","Language modeling is the task of predicting a previously unseen word.","Language modeling is the task of predicting the importance of words."], ans: [1], multi: false },
      { q: "Which statements about QSAR are true?", opts: ["The molecule structure is determined by the bioactivity.","The hypothesis is that similar activities have similar molecular structures.","The hypothesis is that similar molecular structures have similar activities.","The bioactivity is determined by the molecule structure."], ans: [2,3], multi: true },
      { q: "Which statements about recurrent neural networks are true?", opts: ["They incorporate information from previous timesteps of a sequence.","They are suitable for processing sequences of fixed length.","They are suitable for processing sequences of variable length.","They are the same as regular feed-forward NNs if sequence length is fixed."], ans: [0,1,2], multi: true },
      { q: "Which statements about RNN language models are true?", opts: ["An encoder is used to represent each word via a word embedding.","The RNN inputs are the decoder output at current position and RNN output at previous position.","At each position in a sequence, a loss is calculated based on decoder's prediction for next word.","Loss is typically measured with negative log likelihood, as it is essentially a classification problem."], ans: [0,2,3], multi: true },
      { q: "Which statements about sequence data are true?", opts: ["Sequence data is typically displayed in line plots.","There are dedicated ML models that deal with sequence data.","Typically, there is some sort of order in the data (time, position, etc.).","Sequence data cannot be meaningfully displayed in tabular form."], ans: [0,1,2], multi: true },
      { q: "Which statements about sequence data input and feed-forward neural networks are true?", opts: ["Sequence data cannot be an input to a feed-forward neural network.","Sequences with variable lengths must be preprocessed before input.","If the sequence length is equal, a feed-forward NN behaves same as RNN.","The relation of elements in the sequence is lost."], ans: [1,3], multi: true },
      { q: "Which statements about SMILES are true?", opts: ["It is a tabular data representation of a molecule.","SMILES representations are unique.","A molecular graph can be transformed into a SMILES string and vice versa.","A molecule can have different SMILES representations."], ans: [2,3], multi: true },
      { q: "Which statements about the concept of an optimal policy are true?", opts: ["It minimizes the sum of rewards.","The optimal policy may be obtained via Q-learning.","There exists exactly one optimal policy.","Applying the optimal policy essentially means to maximize the immediate reward."], ans: [1], multi: false },
      { q: "Which statements about the one-to-one RNN type are true?", opts: ["Given input Tx=1, output length Ty=1.","Given input Tx=1, output length Ty>1.","Given input Tx>1, output length Ty=1.","Given input Tx>1, output length Ty>1."], ans: [0], multi: false },
      { q: "Which statements about the ReLU activation function are true?", opts: ["For positive inputs, ReLU increases linearly.","ReLU is computationally cheap.","For negative inputs, ReLU equates to values close to 1.","ReLUs can cause the vanishing gradient problem."], ans: [0,1], multi: true },
      { q: "Which statements about the vanishing gradient problem are true?", opts: ["Vanishing gradient can be mitigated by rescaling input values.","Repeated multiplication of gradients smaller than 1 leads to vanishing gradient.","The main culprit is using a 'problematic' activation function such as sigmoid.","Vanishing gradient can be reduced by decreasing number of nodes in hidden layers."], ans: [1,2], multi: true },
      { q: "Which statements about the weights of an RNN are true?", opts: ["For each timestep, the same (shared) weight matrix is used.","The size of the weight matrix is independent of the sequence length.","For sequences of different length, multiple shared weight matrices must be learned.","For each timestep, a dedicated weight matrix is used."], ans: [0,1], multi: true },
      { q: "y = σ'(2×x + 25), x=10. Which are correct?", opts: ["y is in the range (0, 1).","y is close to 0.","y is close to x.","y is in the range (0, 1/4)."], ans: [1,3], multi: true },
    ]
  },
  {
    id: "jku_retry_2024_paper",
    title: "ML Retry Exam — JKU 2024 (Paper)",
    description: "Molecular graphs, drug discovery, dropout, L2 regularization, and more",
    questions: [
      { q: "Which statements about molecular graphs are correct?", opts: ["They have labeled edges.","They are directed.","They have labeled nodes.","They cannot encode 3D information."], ans: [0,2], multi: true },
      { q: "Which statements about QSAR are true?", opts: ["The hypothesis is that similar activities have similar molecular structures.","The molecule structure is determined by the bioactivity.","The bioactivity is determined by the molecule structure.","The hypothesis is that similar molecular structures have similar activities."], ans: [2,3], multi: true },
      { q: "Which statements about the vanishing gradient problem are true?", opts: ["Repeated multiplication of gradients < 1 leads to a vanishing gradient.","The vanishing gradient problem can be mitigated by rescaling input values.","The vanishing gradient problem can be reduced by decreasing number of nodes.","The main culprit of a vanishing gradient is using a 'problematic' activation function such as sigmoid."], ans: [0,3], multi: true },
      { q: "Which statements about high throughput screening (HTS) are true?", opts: ["In HTS, a trained NN predicts whether a molecule is likely to bind/react with the target.","In HTS, a trained NN predicts the 3D structure of a molecule.","HTS is an expensive and time-consuming process.","In HTS, a trained NN predicts the most relevant target molecule for a drug against a specific disease."], ans: [0,2], multi: true },
      { q: "Which statements about sequence data and feed-forward neural networks are true?", opts: ["The relation of elements in the sequence is lost.","Sequences with variable lengths must be preprocessed before input.","Sequence data cannot be an input to a feed-forward neural network.","If sequence length is equal, a feed-forward NN behaves same as a recurrent NN."], ans: [0,1], multi: true },
      { q: "In the context of language models, which statements about an embedding are true?", opts: ["An embedding contains the frequency of a word occurring in a text corpus.","An embedding is a mapping of a word to similar words.","Elements in a word embedding are not allowed to have any relationship with each other.","The encoder part of a language model is closely related to a word embedding."], ans: [3], multi: false },
      { q: "Which architectures/techniques can be used for generative modeling in Drug Discovery?", opts: ["Convolutional Neural Networks","Reinforcement Learning","Variational Autoencoders","Generative Adversarial Networks"], ans: [1,2,3], multi: true },
      { q: "RL scenario: 5×5 grid, reward -2 per move, +15 at target. Which are true?", opts: ["With a bad policy, target might not be reached at all.","Maximum steps of any policy is 5×5×4=100.","Maximum steps of an optimal policy is 8.","An optimal policy always has aggregated positive reward for every starting state."], ans: [0,2], multi: true },
      { q: "Which statements about SMILES are true?", opts: ["A molecular graph can be transformed into a SMILES string and vice versa.","SMILES representations are unique.","It is a tabular data representation of a molecule.","A molecule can have different SMILES representations."], ans: [0,3], multi: true },
      { q: "What is the general data flow through a Transformer language model?", opts: ["input → encoder → feed-forward → self-attention → decoder","input → self-attention → encoder → feed-forward → decoder","input → decoder → feed-forward → self-attention → encoder","input → encoder → self-attention → feed-forward → decoder"], ans: [3], multi: false },
      { q: "Which statements about the concept of an optimal policy are true?", opts: ["The optimal policy may be obtained via Q-learning.","It minimizes the sum of rewards.","Applying the optimal policy essentially means to maximize the immediate reward.","There exists exactly one optimal policy."], ans: [0], multi: false },
      { q: "Problems of RNN-based language models compared to Transformer models?", opts: ["Word embeddings can have a lower dimensionality in Transformer models.","RNN based models cannot be computed in parallel.","Transformer models have a lower parameter count.","LSTMs based models can have problems with capturing contextual information given long input sequences."], ans: [1,3], multi: true },
      { q: "Which statements about RNN language models are true?", opts: ["At each position in a sequence, a loss is calculated based on decoder's prediction for next word.","Loss is typically measured with negative log likelihood.","The RNN inputs are the decoder output at current position and RNN output at previous position.","An encoder is used to represent each word via a word embedding."], ans: [0,1,3], multi: true },
      { q: "Sequence data s of length T with D features at every timestep t. Which are true?", opts: ["D is constant between samples.","D can vary between samples.","T is constant between samples.","For one specific sample, t can be greater than T."], ans: [0,2], multi: true },
      { q: "Gating in an LSTM selects important information ...", opts: ["... by averaging all elements and applying threshold between 0 and 1.","... by element-wise multiplication between -1 (closed) and +1 (open).","... by element-wise multiplication between 0 (closed) and +1 (open).","... by element-wise comparison to feature vector of previous timestep."], ans: [2], multi: false },
      { q: "Which statements about the one-to-one RNN type are true?", opts: ["Given input Tx=1, the output length is Ty>1.","Given input Tx=1, the output length is Ty=1.","Given input Tx>1, the output length is Ty=1.","Given input Tx>1, the output length is Ty>1."], ans: [1], multi: false },
      { q: "The tanh function tanh(x) ...", opts: ["... scales values to the range (0, x).","... scales values to the range (-x, x).","... scales values to the range (0, 1).","... scales values to the range (-1, 1)."], ans: [3], multi: false },
      { q: "The output gate of an LSTM ...", opts: ["... will determine the output of the Constant Error Carousel (CEC).","... will determine the next hidden state of the LSTM.","... will determine the next cell state.","... is typically ReLU activated."], ans: [1], multi: false },
      { q: "Sequence of 8 elements, 10 features each, single-layer RNN with hidden size 6. Size of first output?", opts: ["6","16","48","4"], ans: [0], multi: false },
      { q: "In a Markov decision process ...", opts: ["... reward is associated with the transition from one state to another.","... rewards can be 0.","... rewards can be positive.","... rewards can be negative."], ans: [0,1,2,3], multi: true },
      { q: "In the forward pass of a neural network, the input vector is ...", opts: ["... passed through element-wise non-linearity, multiplied by weight matrix and added to bias.","... added to bias weights, multiplied by weight matrix and passed through non-linearity.","... passed through element-wise non-linearity, added to bias weights and multiplied by weight matrix.","... multiplied by a weight matrix, added to bias weights and passed through element-wise non-linearity."], ans: [3], multi: false },
      { q: "Which statements about the ReLU activation function are true?", opts: ["For negative inputs, ReLU equates to values close to 1.","For positive inputs, ReLU increases linearly.","ReLU is computationally cheap.","ReLU can cause the vanishing gradient problem."], ans: [1,2], multi: true },
      { q: "Which statements about recurrent neural networks are true?", opts: ["They are suitable for processing sequences of variable length.","They incorporate information from previous timesteps of a sequence.","They are the same as regular feed-forward NNs if sequence length is fixed.","They are suitable for processing sequences of fixed length."], ans: [0,1], multi: true },
      { q: "Softmax ...", opts: ["... is a method to compute probabilities.","... can only be used if there are more than 2 classes.","... can only be applied for regression tasks.","... is a generalization of the tanh function."], ans: [0], multi: false },
      { q: "Which statements about (deep) Q-learning are true?", opts: ["Q-learning is an implementation of reinforcement learning.","Q-learning can be applied to any MDP.","Deep Q-learning is often necessary for larger MDPs.","Deep Q-learning is about approximating the Q-value function."], ans: [0,1,2,3], multi: true },
      { q: "A convex function ...", opts: ["... can also be solved iteratively (e.g., via gradient descent) to compute/approximate its minimum.","... always has an analytical solution for computing its minimum.","... can have several local minima.","... sometimes has an analytical solution for computing its minimum."], ans: [0,3], multi: true },
      { q: "Which statements about sequence data are true?", opts: ["There are dedicated ML models that deal with sequence data.","Sequence data is typically displayed in line plots.","Typically, there is some sort of order in the data (time, position, etc.).","Sequence data cannot be meaningfully displayed in tabular form."], ans: [0,1,2], multi: true },
      { q: "Which statements about gating/gates in an LSTM are true?", opts: ["Gates are not affected by gradient computations and therefore the vanishing gradient problem.","Typically, ReLU is used as gate function.","Gates depend on the current input and the past.","There are optional gates."], ans: [2], multi: false },
      { q: "Which statements about Dropout are correct?", opts: ["When using dropout, no other regularization techniques can be applied.","When using dropout, a certain percentage of units in a layer is randomly deactivated.","Dropout typically results in lower training error rates, but helps with overfitting.","As a regularization technique, dropout is only used during model training."], ans: [1,2], multi: true },
      { q: "Q(s,a)←(1-α)Q(s,a)+α(r+γ max Q(s',a')). Which are true?", opts: ["0<α<1 means both old Q-value and new information are used.","α=1 means no update at all is performed.","α=0 means no update at all is performed.","α is the learning rate."], ans: [0,2,3], multi: true },
      { q: "Which statements about L2 regularization are true?", opts: ["L2 regularization is given by L = L + λΣwi²","L2 regularization is given by L = L + λΣ|wi|","L2 regularization is also known as weight decay.","L2 regularization will force the model to adopt larger weights."], ans: [0,2], multi: true },
      { q: "Which statements about language models are true?", opts: ["Language modeling is the task of predicting the importance of words.","Language modeling is the task of predicting a previously unseen word.","Language modeling is the task of predicting a word given a context.","Language modeling is the task of predicting a context given a word."], ans: [2], multi: false },
      { q: "Back-propagation through time ...", opts: ["... generates (potentially) very wide (but not deep) networks.","... allows the mitigation of the vanishing gradients problem in unrolled RNNs.","... is commonly used to train an RNN.","... is the cause of vanishing gradients in RNNs."], ans: [1,2], multi: true },
      { q: "Which statements about gradient descent are true?", opts: ["It might converge to a local minimum.","The initial starting value of a parameter can be chosen randomly.","The learning rate influences how much the value of a parameter changes.","It is an iterative method."], ans: [0,1,2,3], multi: true },
      { q: "y = σ'(2×x + 25), x=10. Which are correct?", opts: ["y is close to x.","y is in the range (0, 1).","y is close to 0.","y is in the range (0, 1/4)."], ans: [2,3], multi: true },
      { q: "Which statements about the weights of an RNN are true?", opts: ["The size of the weight matrix is independent of the sequence length.","For each timestep, the same (shared) weight matrix is used.","For sequences of different length, multiple shared weight matrices must be learned.","For each timestep, a dedicated weight matrix is used."], ans: [0,1], multi: true },
    ]
  },
  {
    id: "jku_retry_jul2024",
    title: "ML Retry Exam — JKU July 2024",
    description: "Non-convex functions, stride, word2vec, self-attention, neural networks general",
    questions: [
      { q: "A non-convex function ...", opts: ["... might have several local minima.","... is rare in deep learning.","... might require gradient descent to determine the minimum.","... requires considerable computational power for closed form solution."], ans: [0,2], multi: true },
      { q: "Dictionary=12000, embedding=350, hidden=300. How many parameters does the decoder matrix have?", opts: ["300×300=90000","12000×300=3600000","12000×350=4200000","300×350=105000"], ans: [1], multi: false },
      { q: "RL scenario: 6×6 grid, reward -1 per move, +1 at target. Which are true?", opts: ["All target-reaching policies have the same aggregated reward.","An optimal policy always has aggregated positive reward for every starting state.","The maximum steps of any policy is 6×6×4=144.","With a bad policy, target might not be reached at all."], ans: [3], multi: false },
      { q: "Sequence of 45 elements, 6 features each, single-layer RNN with hidden size 14. Size of first output?", opts: ["51","14","45","84"], ans: [1], multi: false },
      { q: "Back-propagation through time allows ...", opts: ["... an RNN to keep track of input elements at the beginning of the sequence.","... to save computation time by clipping gradients at every timestep.","... to optimize the parameters of an RNN.","... to circumvent the Vanishing Gradient problem by skipping connections."], ans: [2], multi: false },
      { q: "Q-learning update: Which are true?", opts: ["α is the discount factor.","γ=1 means put strong emphasis on future rewards.","α=1 means no update at all is performed.","γ=0 means only take the immediate reward into account."], ans: [1,3], multi: true },
      { q: "Gating in an LSTM selects important information ...", opts: ["... by combining feature vector with output of the previous timestep.","... by element-wise comparison of feature vector with the accompanying target.","... by element-wise multiplication between -1 (closed) and +1 (open).","... by element-wise multiplication between 0 (closed) and +1 (open)."], ans: [3], multi: false },
      { q: "In a Markov decision process ...", opts: ["... rewards can be positive.","... reward is associated with the transition from one state to another.","... rewards can be negative.","... rewards can be 0."], ans: [0,1,2,3], multi: true },
      { q: "In CNNs, which statements about stride are true?", opts: ["Increasing the stride increases the number of parameters.","Increasing the stride does not affect the output dimensions.","Increasing the stride reduces the spatial dimensions of the output.","Increasing the stride increases the computational cost."], ans: [2], multi: false },
      { q: "In gradient descent ...", opts: ["... a higher learning rate will lead to faster convergence.","... new param value = old param value minus learning rate × gradient of loss.","... small gradients mean the learning rate was chosen incorrectly.","... a smaller learning rate mitigates the vanishing gradient issue."], ans: [1], multi: false },
      { q: "In regression ...", opts: ["... the target value is numeric.","... the target value can be an integer.","... the target value can be a character string.","... the target value can be a floating-point value."], ans: [0,1,3], multi: true },
      { q: "In the context of language models, which statements about an embedding are true?", opts: ["The decoder part is closely related to a word embedding.","An embedding is a compact string representation of words.","An embedding contains the probabilities of a word occurring in a corpus.","The encoder part is closely related to a word embedding."], ans: [3], multi: false },
      { q: "The 3D structure of a molecule ...", opts: ["... is a crucial component when doing QSAR.","... is expensive to determine experimentally.","... can be predicted from the SMILES representation.","... can be derived from the molecular graph."], ans: [1], multi: false },
      { q: "Convolution of a 50×50 image with 4 channels using 2 kernels of 3×3 produces ...", opts: ["... an output with 12 feature maps at 50×50 resolution.","... an output with 2 feature maps at 48×48 resolution.","... an output with 6 feature maps at 50×50 resolution.","... an output with 4 feature maps at 48×48 resolution."], ans: [1], multi: false },
      { q: "The goal of Q-learning is to ...", opts: ["... approximate the expected reward for the next state-transition.","... predict the agent's next action based on previous actions.","... approximate the Q-values of state-action pairs of an MDP.","... find the optimal degree of exploration and exploitation."], ans: [2], multi: false },
      { q: "The original CEC (constant error carousel) of an LSTM ...", opts: ["... uses ReLU as its activation function.","... represents the long-term memory.","... can mitigate the vanishing gradient problem.","... is influenced by the introduction of the forget gate."], ans: [1,2,3], multi: true },
      { q: "The protein folding problem deals with ...", opts: ["... determining how to fold a protein for desired biological functionality.","... predicting biological functionality from 3D structure.","... predicting the amino acid sequence from 3D structure.","... predicting the 3D structure from the amino acid sequence."], ans: [3], multi: false },
      { q: "What is the general data flow through an RNN language model?", opts: ["input → RNN → encoder → decoder","input → encoder → RNN → decoder","input → encoder → decoder → RNN","input → decoder → RNN → encoder"], ans: [1], multi: false },
      { q: "Which activation functions can be used to mitigate the vanishing gradient problem?", opts: ["Leaky ReLU","SELU","Tanh","ReLU"], ans: [0,1,3], multi: true },
      { q: "Correct formula for the backward pass (input x, weights W, bias b, activation f)?", opts: ["gradient = x * f'(W + b)","gradient = f'(x) * W + b","gradient = f'(x * W + b)","gradient = f'(x * W) + b"], ans: [2], multi: false },
      { q: "Which statements about generative models in drug discovery are true?", opts: ["Generative models generate new molecules according to the target or desired bioactivity.","Generative models have produced a significant number of promising compounds such as the novel antibiotic Halicin.","Generative models generate protein configurations according to target molecule structure.","Generative models are promising since the chemical drug universe is too big for standard techniques."], ans: [0,3], multi: true },
      { q: "Which statements about reinforcement learning are true?", opts: ["Often, initial knowledge about transition probabilities or rewards is missing.","A RL problem can be formulated by a Markov decision process.","The goal of reinforcement learning is to learn the optimal policy.","Games are one of many application areas of reinforcement learning."], ans: [0,1,2,3], multi: true },
      { q: "Which statements about tabular data are correct?", opts: ["Sequence data cannot be stored in tabular form.","In principle, images can be stored in tabular form.","Rows in the table are called features.","There can be more features than samples in tabular data."], ans: [1,3], multi: true },
      { q: "Which statements about data augmentation are true?", opts: ["Data augmentation will reduce the number of features in the data.","Data augmentation can help mitigate the vanishing gradient issue.","Data augmentation is useful to decrease the variation in the data.","Data augmentation can help prevent overfitting."], ans: [3], multi: false },
      { q: "Which statements about gating/gates in an LSTM are true?", opts: ["Gates depend on the current input and the past.","Typically, sigmoid is used as gate function.","Gating is used to control what to read/write/forget in memory.","The parameters of the gates are optimized during training."], ans: [0,1,2,3], multi: true },
      { q: "Which statements about QSAR are true?", opts: ["There is no relationship between complexity of molecule and its bioactivity.","The bio-activity is determined by the molecular structure.","Large and complex molecules typically show higher bioactivity.","The hypothesis is that similar molecular structures have similar activities."], ans: [1,3], multi: true },
      { q: "Which statements about recurrent neural networks are true?", opts: ["They incorporate information from previous timesteps.","They are suitable for processing sequences of variable length.","They are suitable for processing sequences of fixed length.","They incorporate information from the current timestep."], ans: [0,1,2,3], multi: true },
      { q: "Which statements about RNN language models are true?", opts: ["The overall loss is often calculated over mini-batches.","At each position, a loss is calculated based on decoder's prediction for next word.","At end of sequence, one final loss is calculated based on sequence overlap.","The overall loss is the average loss values over the entire training set."], ans: [0,1,3], multi: true },
      { q: "Which statements about sequence data and feed-forward neural networks are true?", opts: ["If sequence length is equal, a feed-forward NN behaves same as a recurrent NN.","Sequences with variable lengths must be preprocessed before input.","The relation of elements in the sequence is lost.","Sequence data cannot be an input to a feed-forward neural network."], ans: [1,2], multi: true },
      { q: "Which statements about SMILES are true?", opts: ["SMILES is not the only form of representing a molecule.","A molecule can have different SMILES representations.","3D structure cannot be fully represented using SMILES.","A molecular graph can be transformed into SMILES and vice versa."], ans: [0,1,2,3], multi: true },
      { q: "Which statements about the concept of an optimal policy are true?", opts: ["There can be multiple optimal policies.","Applying the optimal policy essentially means to maximize the immediate reward.","An optimal policy will minimize the cumulative reward.","The optimal policy may be obtained via Q-learning."], ans: [0,3], multi: true },
      { q: "Which statements about the many-to-many RNN type are true?", opts: ["Given input Tx>1, output length Ty>1.","Given input Tx>1, output length Ty=1.","Given input Tx=1, output length Ty>1.","Given input Tx=1, output length Ty=1."], ans: [0], multi: false },
      { q: "Which statements about the ReLU activation function are true?", opts: ["For positive inputs, ReLU is equivalent to Leaky ReLU.","For positive inputs, ReLU equates to the identity function.","The derivative has a maximum value of 0.25.","For negative inputs, the derivative is -1."], ans: [0,1], multi: true },
      { q: "Which statements about the vanishing gradient problem are true?", opts: ["A vanishing gradient effectively means that the model does not learn.","Repeated multiplication of gradients > 1 leads to a vanishing gradient.","Repeated multiplication of gradients < 1 leads to a vanishing gradient.","A vanishing gradient will be more likely when input values are not standardized."], ans: [0,2], multi: true },
      { q: "Which statements about Self-Attention are true?", opts: ["To compute Self-Attention, keys and queries are crucial components.","The value vector in Self-Attention consists of parameters not optimized during training.","Self-Attention can be computed in parallel.","Self-Attention allows a Transformer to learn contextual information."], ans: [0,2,3], multi: true },
      { q: "Which statements about word embeddings (word2vec) are true?", opts: ["A major advantage of word2vec is that no large text corpora are necessary.","Similar words should be mapped to similar regions in feature space.","Skip gram predicts one target word given surrounding context words.","Similarity of word embeddings can be measured with cosine similarity."], ans: [1,3], multi: true },
      { q: "Which statements are true about neural networks in general?", opts: ["In principle, we can stack an arbitrary number of hidden layers.","Weights and biases will perform a linear transformation of the input data.","Activation functions are necessary to introduce non-linearity.","In feed-forward NNs, the output layer should contain more nodes than the input layer."], ans: [0,1,2], multi: true },
      { q: "Why is it a good idea to have a separate test set in addition to a training set?", opts: ["Empirical risk minimization can be performed on two data sets.","It allows to get a better estimate of the generalization error.","It can be used to tune hyperparameters.","It can be used to further optimize the model parameters."], ans: [1], multi: false },
      { q: "Deep networks and vanishing gradients — which are true?", opts: ["The deeper the network, the more multiplications in the forward pass.","Deep networks will always suffer from the vanishing gradient problem.","The vanishing gradient problem will typically occur towards the input layer.","The chain rule reduces the effect of the vanishing gradient."], ans: [2], multi: false },
      { q: "y = σ'(-400) × σ'(300). Which are correct?", opts: ["y cannot be computed in this case.","y is a positive value.","y is a negative value.","y is close to 0."], ans: [1,3], multi: true },
    ]
  }
];

function arrMatch(a, b) {
  return a.length === b.length && [...a].sort().join() === [...b].sort().join();
}

function freshState(questions) {
  return { sel: questions.map(() => []), done: questions.map(() => false), scores: questions.map(() => null) };
}

const btnBase = { padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, border: "1px solid #d1d5db", background: "transparent", color: "#111" };
const btnBlue = { ...btnBase, border: "none", background: "#3b82f6", color: "white", fontWeight: 500 };
const btnGreen = { ...btnBase, border: "none", background: "#16a34a", color: "white", fontWeight: 500 };

export default function App() {
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [cur, setCur] = useState(0);
  const [state, setState] = useState(null);
  const [showResults, setShowResults] = useState(false);

  function startQuiz(id) {
    setActiveQuizId(id);
    setCur(0);
    setState(freshState(QUIZ_BANK.find(q => q.id === id).questions));
    setShowResults(false);
  }

  function backToMenu() { setActiveQuizId(null); setShowResults(false); }

  if (!activeQuizId) {
    return (
      <div style={{ padding: "24px 16px", fontFamily: "system-ui, sans-serif", maxWidth: 700 }}>
        <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Quiz Bank</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>Send more PDFs to add more quizzes!</div>
        {QUIZ_BANK.map(quiz => (
          <div key={quiz.id} onClick={() => startQuiz(quiz.id)}
            style={{ border: "1px solid #d1d5db", borderRadius: 12, padding: "16px 20px", marginBottom: 12, cursor: "pointer", background: "#f9fafb" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
            onMouseLeave={e => e.currentTarget.style.background = "#f9fafb"}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{quiz.title}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>{quiz.description}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{quiz.questions.length} questions</div>
          </div>
        ))}
      </div>
    );
  }

  const quiz = QUIZ_BANK.find(q => q.id === activeQuizId);
  const Qs = quiz.questions;
  const { sel, done, scores } = state;
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

  if (showResults) {
    const pct = Math.round(correctCount / Qs.length * 100);
    const grade = pct >= 90 ? "Excellent! 🏆" : pct >= 75 ? "Great job! ⭐" : pct >= 60 ? "Good effort! 👍" : "Keep studying! 📚";
    return (
      <div style={{ padding: "32px 16px", textAlign: "center", fontFamily: "system-ui, sans-serif", maxWidth: 700 }}>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>{quiz.title}</div>
        <div style={{ fontSize: 56, fontWeight: 600 }}>{pct}%</div>
        <div style={{ color: "#6b7280", marginBottom: 24, fontSize: 18 }}>{grade}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24, maxWidth: 360, margin: "0 auto 24px" }}>
          {[["Correct", correctCount, "#16a34a"], ["Wrong", Qs.length - correctCount, "#dc2626"], ["Total", Qs.length, "#374151"]].map(([l, n, c]) => (
            <div key={l} style={{ background: "#f3f4f6", borderRadius: 8, padding: "12px 8px" }}>
              <div style={{ fontSize: 28, fontWeight: 600, color: c }}>{n}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => startQuiz(activeQuizId)} style={btnBase}>Restart quiz</button>
          <button onClick={backToMenu} style={btnBlue}>← All quizzes</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", fontFamily: "system-ui, sans-serif", maxWidth: 700 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button onClick={backToMenu} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#6b7280", padding: 0 }}>← Quizzes</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: "#dcfce7", color: "#15803d", borderRadius: 99, padding: "2px 10px", fontWeight: 600, fontSize: 13 }}>✓ {correctCount}</span>
          <span style={{ background: "#fee2e2", color: "#b91c1c", borderRadius: 99, padding: "2px 10px", fontWeight: 600, fontSize: 13 }}>✗ {wrongCount}</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>
        <span>Question {cur + 1} of {Qs.length}</span>
        <span>{q.multi ? "Select all that apply" : "Select one answer"}</span>
      </div>
      <div style={{ background: "#e5e7eb", borderRadius: 99, height: 6, marginBottom: 20 }}>
        <div style={{ background: "#3b82f6", height: 6, borderRadius: 99, width: `${Math.round(cur / Qs.length * 100)}%`, transition: "width 0.3s" }} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.5, marginBottom: 16 }}>{q.q}</div>
      {q.opts.map((o, oi) => {
        const isC = q.ans.includes(oi), isS = curSel.includes(oi);
        let bg = "#f9fafb", border = "#d1d5db", color = "#111";
        if (isDone) {
          if (isS && isC) { bg = "#dcfce7"; border = "#16a34a"; color = "#15803d"; }
          else if (isS && !isC) { bg = "#fee2e2"; border = "#dc2626"; color = "#b91c1c"; }
          else if (!isS && isC) { bg = "#dcfce7"; border = "#16a34a"; color = "#15803d"; }
        } else if (isS) { bg = "#dbeafe"; border = "#3b82f6"; color = "#1d4ed8"; }
        return (
          <button key={oi} onClick={() => toggle(oi)} disabled={isDone}
            style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", marginBottom: 8, border: `1px solid ${border}`, borderRadius: 8, background: bg, color, cursor: isDone ? "default" : "pointer", fontSize: 14, transition: "all 0.15s" }}>
            {String.fromCharCode(65 + oi)}. {o}
          </button>
        );
      })}
      {isDone && (
        <div style={{ padding: "10px 14px", borderRadius: 8, marginTop: 8, fontSize: 13, background: scores[cur] ? "#dcfce7" : "#fee2e2", color: scores[cur] ? "#15803d" : "#b91c1c", border: `1px solid ${scores[cur] ? "#16a34a" : "#dc2626"}` }}>
          {scores[cur] ? "✓ Correct!" : "✗ Not quite — green options show the correct answers."}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        {cur > 0 && <button onClick={() => setCur(c => c - 1)} style={btnBase}>← Back</button>}
        {!isDone && <button onClick={submit} style={btnBlue}>Check answer</button>}
        {isDone && cur < Qs.length - 1 && <button onClick={() => setCur(c => c + 1)} style={btnBlue}>Next →</button>}
        {!isDone && cur < Qs.length - 1 && <button onClick={() => setCur(c => c + 1)} style={btnBase}>Skip →</button>}
        {allDone && cur === Qs.length - 1 && <button onClick={() => setShowResults(true)} style={btnGreen}>See results</button>}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 20 }}>
        {Qs.map((_, i) => {
          const bg = i === cur ? "#3b82f6" : done[i] ? (scores[i] ? "#16a34a" : "#dc2626") : "#d1d5db";
          return <button key={i} onClick={() => setCur(i)} title={`Q${i + 1}`} style={{ width: 16, height: 16, borderRadius: "50%", background: bg, border: "none", cursor: "pointer", padding: 0 }} />;
        })}
      </div>
    </div>
  );
}
