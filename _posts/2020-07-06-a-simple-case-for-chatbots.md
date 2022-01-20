---
layout: post
title: "A simple case for chatbot websites"
date: 2020-07-06 09:57:55 -0500
category: article
excerpt_separator: <!--more-->
---

I found the idea of chatbots very exciting when the trend started a few years ago, to the point that I tried to build a startup around chatbot based food delivery (it didn’t go well). The allure to me was the potential to simplify the web. Chatbots allow you to break down complex websites into a decision tree of actions, rather than a scavenger hunt of links.

<!--more-->

![A terminal screen showing a telnet application](/assets/img/posts/2020-07-06-a-simple-case-for-chatbots/1.jpeg)

## Chatbots and Telnet

One can draw a parallel between chatbots and classic command line based systems of old. When done correctly, both focus on performing actions quickly, without distracting design elements. Telnet based applications (like the one pictured above) were predictable, as the path to your desired action remained constant. This allowed users to easily memorize the steps needed to perform certain actions. Combined with the sole focus on actions and information, power users were able to quickly navigate these menu based applications.

With chatbots, we have the opportunity to expand upon the systems of old. We can create predictable, action focused applications, while leveraging modern UX patterns to provide more context.

## Banking with a bot

![Animated demonstration of a chatbot showing a bank account balance](/assets/img/posts/2020-07-06-a-simple-case-for-chatbots/2.gif)

In this example, we transform the typical banking experience using a very simple chatbot.

On the left, the chatbot provides context and actions the user can perform. These actions remain constant and predictable, allowing quick navigation.

We utilize the white space on the right to provide more context to the options. This allows the user to get a better overview of the information they’re looking for, without requiring them to dive into multiple layers of chatbot conversation.

![Animated demonstration of a chatbot showing a bank account balance](/assets/img/posts/2020-07-06-a-simple-case-for-chatbots/3.gif)

By allowing simple interactions with the right side, the user can further skip layers of conversation, while maintaining the constant predictability and simplicity that Telnet applications provided. This approach allows the user to discover different possible actions, without navigating away or obscuring the information with dialogs. In the above example, these user is able to select a transaction on the right, and use the chatbot to discover possible actions to take against the transaction.

![Chatbot showing how much a user has spent in the past month](/assets/img/posts/2020-07-06-a-simple-case-for-chatbots/4.png)

Our chatbot approach provides room for further optimizations. By adding keyboard shortcuts to our actions, the user would be able to quickly navigate from the keyboard. This allows power users to breeze through the menus.

The addition of a response box gives the user the opportunity to skip branches of the decision tree by simply typing the action they wish to complete. Autocomplete helps give context on available actions, as do the action bubbles.

![Banking chatbot with autocomplete suggesting a response](/assets/img/posts/2020-07-06-a-simple-case-for-chatbots/5.png)

## Mobile and accessibility

The chatbot approach scales naturally to mobile devices by combining the left and right sides to a single column.

In addition, this approach to building applications is extremely accessible by nature. As navigation is primarily driven by questions and answers, users that depend on screen readers will have a much easier time than on traditional websites that depend on hunting down links.

## Summary

Although this was a simple design exercise, it demonstrates that there are advantages to simplifying complex applications. By distilling a site’s content to the actions most commonly performed in a way that promotes quick, consistent navigation, we can provide a pretty great user experience.
